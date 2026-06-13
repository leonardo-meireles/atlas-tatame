#!/usr/bin/env bash
# Instala as deps do agent pose-from-video: yt-dlp + ffmpeg + whisper.cpp + modelo ggml.
# Idempotente: pula o que já existe. Direitos: vídeo é insumo descartável (fair use).
set -euo pipefail

WHISPER_MODEL="${WHISPER_MODEL:-base}"
MODEL_DIR="${WHISPER_MODEL_DIR:-$HOME/.cache/whisper}"
MODEL_FILE="$MODEL_DIR/ggml-${WHISPER_MODEL}.bin"
MODEL_URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${WHISPER_MODEL}.bin"

log() { printf '\n>> %s\n' "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }

OS="$(uname -s)"
log "OS detectado: $OS"

install_macos() {
  if ! have brew; then
    echo "ERRO: Homebrew ausente. Instale em https://brew.sh e rode de novo." >&2
    exit 1
  fi
  for pkg in yt-dlp ffmpeg whisper-cpp; do
    if brew list --formula "$pkg" >/dev/null 2>&1; then
      log "$pkg já instalado (skip)"
    else
      log "brew install $pkg"
      brew install "$pkg"
    fi
  done
}

install_linux() {
  if have apt-get; then
    log "apt-get: ffmpeg"
    sudo apt-get update -y
    sudo apt-get install -y ffmpeg
  fi
  # yt-dlp: pip é o caminho mais portátil entre distros.
  if ! have yt-dlp; then
    if have pipx; then
      log "pipx install yt-dlp"
      pipx install yt-dlp
    elif have pip3; then
      log "pip3 install --user yt-dlp"
      pip3 install --user yt-dlp
    else
      echo "ERRO: instale pipx ou pip3 pra obter yt-dlp." >&2
      exit 1
    fi
  else
    log "yt-dlp já instalado (skip)"
  fi
  # whisper.cpp: não há pacote universal — orienta build manual.
  if ! have whisper-cli && ! have whisper-cpp && ! have main; then
    cat >&2 <<'EOF'

AVISO: whisper.cpp não encontrado no Linux. Compile manualmente:
  git clone https://github.com/ggerganov/whisper.cpp
  cd whisper.cpp && make
  sudo cp build/bin/whisper-cli /usr/local/bin/  # ou ajuste o PATH

EOF
  else
    log "whisper.cpp já disponível (skip)"
  fi
}

case "$OS" in
  Darwin) install_macos ;;
  Linux)  install_linux ;;
  *) echo "ERRO: OS não suportado: $OS" >&2; exit 1 ;;
esac

# ── Modelo ggml ──
if [ -f "$MODEL_FILE" ]; then
  log "Modelo já existe: $MODEL_FILE (skip)"
else
  log "Baixando modelo whisper ($WHISPER_MODEL) → $MODEL_FILE"
  mkdir -p "$MODEL_DIR"
  if have curl; then
    curl -L -o "$MODEL_FILE" "$MODEL_URL"
  elif have wget; then
    wget -O "$MODEL_FILE" "$MODEL_URL"
  else
    echo "ERRO: curl ou wget necessário pra baixar o modelo." >&2
    exit 1
  fi
fi

log "Deps prontas."
echo "export AGENT_DEPS_INSTALLED=1"
