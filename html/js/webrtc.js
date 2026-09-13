(() => {
  "use strict";

  /*
   * WebRTC para consulta.html
   *
   * O backend NestJS esperado expõe o namespace Socket.IO:
   *   /webrtc
   *
   * Eventos:
   *   cliente -> servidor: join_room, offer, answer, ice_candidate,
   *                         end_call, restart_call
   *   servidor -> cliente: room_joined, participant_joined, offer, answer,
   *                         ice_candidate, call_ended, participant_left,
   *                         participant_restarted
   */

  const socket = io("/webrtc");

  const localVideo = document.getElementById("localVideo");
  const remoteVideo = document.getElementById("remoteVideo");
  const waiting = document.getElementById("waiting");
  const status = document.getElementById("statusText");
  const consultationStatus = document.getElementById("consultationStatus");
  const toast = document.getElementById("toast");
  const micBtn = document.getElementById("micBtn");
  const cameraBtn = document.getElementById("cameraBtn");
  const endBtn = document.getElementById("endBtn");


  let localStream = null;
  let peerConnection = null;
  let roomId = new URLSearchParams(window.location.search).get("id");
  let isInitiator = false;
  let hasRemoteParticipant = false;
  let endedLocally = false;
  let makingOffer = false;
  let pendingCandidates = [];
  let audioRecorder = null;
  let audioSequence = 0;
  let audioRecording = false;

  // Se consulta.html for aberta sem ?id=..., cria uma sala temporária.
  if (!roomId) {
    roomId = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)
      .replace(/-/g, "")
      .slice(0, 20);
    console.warn("Nenhum id de sala foi informado. Sala temporária:", roomId);
  }

  function iniciarCapturaAudio() {
    if (!localStream) {
      console.warn("localStream ainda não disponível.");
      return;
    }

    const audioTracks = localStream.getAudioTracks();

    if (!audioTracks.length) {
      console.warn("Nenhuma faixa de áudio encontrada.");
      return;
    }

    const audioStream = new MediaStream(audioTracks);

    let mimeType = "";

    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
      mimeType = "audio/webm;codecs=opus";
    } else if (MediaRecorder.isTypeSupported("audio/webm")) {
      mimeType = "audio/webm";
    } else {
      console.error("Este navegador não suporta gravação WebM.");
      return;
    }

    audioRecording = true;

    function gravarBloco() {
      // Se a gravação foi interrompida, não cria outro recorder.
      if (!audioRecording) {
        return;
      }

      const chunks = [];

      const sequence = audioSequence++;
      const inicio = Date.now();

      let recorder;

      try {
        recorder = new MediaRecorder(audioStream, {
          mimeType,
        });
      } catch (error) {
        console.error("Erro ao criar MediaRecorder:", error);
        audioRecording = false;
        return;
      }

      audioRecorder = recorder;

      recorder.onstart = () => {
        console.log(
          `[AUDIO] Gravação iniciada. seq=${sequence}`
        );
      };

      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onerror = event => {
        console.error(
          `[AUDIO] Erro no MediaRecorder seq=${sequence}:`,
          event.error
        );
      };

      recorder.onstop = () => {
        const duracao = Date.now() - inicio;

        console.log(
          `[AUDIO] Gravação finalizada. seq=${sequence} duração=${duracao}ms`
        );

        /*
        * Só agora montamos o Blob.
        *
        * Como o recorder foi iniciado e depois parado,
        * esse Blob representa uma gravação WebM completa.
        */
        if (chunks.length > 0) {
          const blob = new Blob(chunks, {
            type: mimeType,
          });

          console.log(
            `[AUDIO] Bloco completo seq=${sequence}:`,
            Math.round(blob.size / 1024),
            "KB"
          );

          enviarAudioParaBackend(blob);
        } else {
          console.warn(
            `[AUDIO] Nenhum dado gravado no bloco seq=${sequence}`
          );
        }

        audioRecorder = null;

        /*
        * Começa um NOVO recorder somente depois que
        * o anterior terminou.
        */
        if (audioRecording) {
          setTimeout(() => {
            gravarBloco();
          }, 50);
        }
      };

      try {
        recorder.start();

        /*
        * Este recorder fica aberto por 5 segundos.
        * Depois é encerrado explicitamente.
        */
        setTimeout(() => {
          if (
            recorder &&
            recorder.state !== "inactive"
          ) {
            recorder.stop();
          }
        }, 5000);

      } catch (error) {
        console.error(
          `[AUDIO] Erro ao iniciar gravação seq=${sequence}:`,
          error
        );

        audioRecorder = null;
        audioRecording = false;
      }
    }

    console.log(
      `[AUDIO] Iniciando captura contínua. MIME=${mimeType}`
    );

    gravarBloco();
  }
  
  function enviarAudioParaBackend(blob) {
    if (!socket.connected) {
      console.warn("Socket desconectado. Bloco de áudio descartado.");
      return;
    }

    const sequence = audioSequence++;

    socket.emit("audio_chunk", {
      roomId,
      sequence,
      timestamp: Date.now(),
      audio: blob,
    });

    console.log(
      `Bloco de áudio #${sequence} enviado:`,
      Math.round(blob.size / 1024),
      "KB",
    );
  }

  function msg(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(msg.timer);
    msg.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function setStatus(main, secondary) {
    if (main) status.textContent = main;
    if (secondary !== undefined) consultationStatus.textContent = secondary;
  }

  function setWaiting(show) {
    waiting.style.display = show ? "flex" : "none";
  }

  function createPeerConnection() {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
        // Produção: adicione também um servidor TURN.
      ]
    });

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.ontrack = event => {
      const [stream] = event.streams;
      if (stream) {
        remoteVideo.srcObject = stream;
        setWaiting(false);
        setStatus("Conectado", "Consulta em andamento");
      }
    };

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;

      if (state === "connected") {
        setStatus("Conectado", "Consulta em andamento");
        setWaiting(false);
      } else if (state === "connecting") {
        setStatus("Conectando...", "Estabelecendo conexão");
      } else if (state === "disconnected") {
        setStatus("Conexão instável", "Tentando reconectar");
      } else if (state === "failed") {
        setStatus("Falha na conexão", "Não foi possível conectar");
        setWaiting(true);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (!peerConnection) return;

      if (peerConnection.iceConnectionState === "failed") {
        // Tenta reiniciar ICE sem destruir a câmera/microfone.
        renegotiate(true).catch(console.error);
      }
    };

    return peerConnection;
  }

  async function iniciarMidia() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localVideo.srcObject = localStream;

      iniciarCapturaAudio();

      setStatus("Aguardando participante", "Sala: " + roomId);
      msg("Câmera e microfone ativados");

      entrarNaSala();
    } catch (error) {
      console.error(error);
      setStatus("Permissão necessária", "Não foi possível acessar a câmera");
      msg("Permita o acesso à câmera e ao microfone.");
    }
  }

  function entrarNaSala() {
    socket.emit("join_room", {
      roomId,
      role: "participant"
    });
  }

  async function renegotiate(iceRestart = false) {
    if (!peerConnection || !hasRemoteParticipant || endedLocally) return;
    if (makingOffer) return;

    makingOffer = true;

    try {
      const offer = await peerConnection.createOffer({ iceRestart });
      await peerConnection.setLocalDescription(offer);

      socket.emit("offer", {
        offer: peerConnection.localDescription
      });
    } finally {
      makingOffer = false;
    }
  }

  async function handleOffer(offer) {
    if (!peerConnection) createPeerConnection();

    try {
      await peerConnection.setRemoteDescription(offer);

      for (const candidate of pendingCandidates) {
        await peerConnection.addIceCandidate(candidate);
      }
      pendingCandidates = [];

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit("answer", {
        answer: peerConnection.localDescription
      });
    } catch (error) {
      console.error("Erro ao processar offer:", error);
      msg("Erro ao estabelecer a chamada.");
    }
  }

  async function handleAnswer(answer) {
    if (!peerConnection) return;

    try {
      await peerConnection.setRemoteDescription(answer);

      for (const candidate of pendingCandidates) {
        await peerConnection.addIceCandidate(candidate);
      }
      pendingCandidates = [];
    } catch (error) {
      console.error("Erro ao processar answer:", error);
    }
  }

  async function handleIceCandidate(candidate) {
    if (!candidate) return;

    if (!peerConnection || !peerConnection.remoteDescription) {
      pendingCandidates.push(candidate);
      return;
    }

    try {
      await peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error("Erro ao adicionar ICE candidate:", error);
    }
  }

  function closePeerOnly() {
    if (peerConnection) {
      peerConnection.ontrack = null;
      peerConnection.onicecandidate = null;
      peerConnection.onconnectionstatechange = null;
      peerConnection.oniceconnectionstatechange = null;
      peerConnection.close();
      peerConnection = null;
    }

    remoteVideo.srcObject = null;
    setWaiting(true);
  }

  function encerrarChamada() {
    if (endedLocally) return;

    endedLocally = true;
    hasRemoteParticipant = false;

    // IMPORTANTE:
    // Não usamos track.stop().
    // Assim câmera/microfone continuam disponíveis nesta página.
    localStream?.getTracks().forEach(track => {
      track.enabled = false;
    });

    closePeerOnly();

    socket.emit("end_call");

    endBtn.textContent = "↻";
    endBtn.title = "Retomar chamada";
    setStatus("Você saiu da consulta", "Chamada encerrada");
    msg("Consulta encerrada");
  }

  function reiniciarChamada() {
    endedLocally = false;

    localStream?.getTracks().forEach(track => {
      track.enabled = true;
    });

    micBtn.classList.remove("off");
    micBtn.textContent = "🎤";
    cameraBtn.classList.remove("off");
    cameraBtn.textContent = "📷";

    endBtn.textContent = "☎";
    endBtn.title = "Encerrar chamada";

    closePeerOnly();
    createPeerConnection();

    setStatus("Aguardando conexão", "Retomando consulta...");

    // O outro cliente recebe este evento e também prepara seu PeerConnection.
    socket.emit("restart_call");
  }

  micBtn?.addEventListener("click", () => {
    const track = localStream?.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    micBtn.classList.toggle("off", !track.enabled);
    micBtn.textContent = track.enabled ? "🎤" : "🔇";
    msg(track.enabled ? "Microfone ativado" : "Microfone desligado");
  });

  cameraBtn?.addEventListener("click", () => {
    const track = localStream?.getVideoTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    cameraBtn.classList.toggle("off", !track.enabled);
    cameraBtn.textContent = track.enabled ? "📷" : "🚫";
    msg(track.enabled ? "Câmera ativada" : "Câmera desligada");
  });

  endBtn?.addEventListener("click", () => {
    if (endedLocally) {
      reiniciarChamada();
    } else {
      encerrarChamada();
    }
  });

  socket.on("connect", () => {
    setStatus("Entrando na sala...", "Conectando ao servidor");
  });

  socket.on("connect_error", error => {
    console.error("Socket.IO:", error);
    setStatus("Servidor indisponível", "Não foi possível conectar ao backend");
  });

  socket.on("room_joined", data => {
    isInitiator = Boolean(data.isInitiator);
    hasRemoteParticipant = data.participants > 1;

    if (!peerConnection) createPeerConnection();

    if (hasRemoteParticipant) {
      setStatus("Conectando...", "Outro participante encontrado");
      setWaiting(false);

      // Somente o primeiro participante cria o offer inicial.
      if (isInitiator) {
        renegotiate().catch(console.error);
      }
    } else {
      setStatus("Aguardando participante", "Sala: " + roomId);
      setWaiting(true);
    }
  });

  socket.on("participant_joined", () => {
    if (endedLocally) return;

    hasRemoteParticipant = true;
    setStatus("Conectando...", "Outro participante entrou");
    setWaiting(false);

    // O participante que já estava na sala é o iniciador.
    if (isInitiator) {
      renegotiate().catch(console.error);
    }
  });

  socket.on("offer", ({ offer }) => {
    if (endedLocally) return;
    hasRemoteParticipant = true;
    handleOffer(offer);
  });

  socket.on("answer", ({ answer }) => {
    if (endedLocally) return;
    handleAnswer(answer);
  });

  socket.on("ice_candidate", ({ candidate }) => {
    if (endedLocally) return;
    handleIceCandidate(candidate);
  });

  socket.on("call_ended", () => {
    hasRemoteParticipant = false;
    closePeerOnly();
    setStatus("Outro participante encerrou", "Chamada encerrada");
    msg("O outro participante encerrou a chamada.");

    // A câmera/microfone continuam disponíveis localmente.
    localStream?.getTracks().forEach(track => {
      track.enabled = false;
    });

    endBtn.textContent = "↻";
    endBtn.title = "Retomar chamada";
    endedLocally = true;
  });

  socket.on("participant_restarted", () => {
    if (endedLocally) return;

    hasRemoteParticipant = true;
    closePeerOnly();
    createPeerConnection();

    setStatus("Conectando...", "Outro participante retomou a chamada");
    setWaiting(false);

    // Quem é o iniciador faz a nova oferta.
    if (isInitiator) {
      renegotiate().catch(console.error);
    }
  });

  socket.on("participant_left", () => {
    hasRemoteParticipant = false;
    closePeerOnly();

    if (!endedLocally) {
      setStatus("Aguardando participante", "O outro participante saiu");
      msg("O outro participante saiu da consulta.");
    }
  });

  // Pequena extensão esperada no Gateway NestJS:
  // relay do evento restart_call para os demais membros da sala.
  window.addEventListener("beforeunload", () => {
    // Não encerramos a câmera/microfone aqui deliberadamente.
    // O navegador cuidará das tracks ao fechar a página.
  });

  // Inicia tudo.
  iniciarMidia();

  // Exposto para debug no console, se necessário.
  window.digitalyWebRTC = {
    get roomId() { return roomId; },
    get socketId() { return socket.id; },
    get localStream() { return localStream; },
    get peerConnection() { return peerConnection; },

    restart: reiniciarChamada,
    end: encerrarChamada,

    processarIA: () => {
      socket.emit("processar_ia");
    }
  };
})();
