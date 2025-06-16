let audioContext, analyser, source, dataArray, animationId;

export function startVoice() {
  document.getElementById('voiceModal').style.display = 'flex';

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      drawWaveform();
    })
    .catch(err => {
      alert('Microphone access denied or not available.');
      stopVoice();
    });
}

function drawWaveform() {
  const canvas = document.getElementById('waveformCanvas');
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const barCount = 4;
    const barWidth = Math.min(10, canvas.width * 0.04);
    const spacing = Math.min(20, canvas.width * 0.08);
    const totalWidth = (barWidth * barCount) + (spacing * (barCount - 1));
    const startX = (canvas.width - totalWidth) / 2;

    for (let i = 0; i < barCount; i++) {
      const index = i * 5;
      const value = dataArray[index] || 0;
      const maxHeight = canvas.height * 0.4;
      const barHeight = (value / 255) * maxHeight;
      const x = startX + i * (barWidth + spacing);
      const y = centerY - barHeight / 2;

      const radius = barWidth / 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, y + barHeight - radius);
      ctx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight);
      ctx.lineTo(x + radius, y + barHeight);
      ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();

      // Base circle
      ctx.beginPath();
      ctx.arc(x + barWidth / 2, centerY, barWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  draw();
}

export function stopVoice() {
  document.getElementById('voiceModal').style.display = 'none';
  if (animationId) cancelAnimationFrame(animationId);
  if (audioContext) audioContext.close();
}
