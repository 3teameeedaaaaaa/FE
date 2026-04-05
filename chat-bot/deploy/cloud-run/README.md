# Cloud Run Deploy

이 폴더는 `python_ai_server`의 GCP Cloud Run 배포 전용 설정을 분리해둔 디렉터리입니다.

루트 앱 코드는 수정하지 않고, 아래 Dockerfile을 사용해 이미지를 빌드합니다.

## 1. 사전 준비

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

## 2. Artifact Registry 저장소 생성

최초 1회만 실행합니다.

```bash
gcloud artifacts repositories create my-repo \
  --repository-format=docker \
  --location=asia-northeast3 \
  --description="Docker repository for Python AI Server"
```

## 3. Docker 인증

```bash
gcloud auth configure-docker asia-northeast3-docker.pkg.dev
```

## 4. 이미지 빌드

빌드 컨텍스트는 프로젝트 루트이고, Dockerfile만 이 폴더를 사용합니다.

```bash
cd /Users/kyu/hackert/python_ai_server
docker build \
  -f deploy/cloud-run/Dockerfile \
  -t asia-northeast3-docker.pkg.dev/YOUR_PROJECT_ID/my-repo/python-ai-server:latest \
  .
```

## 5. 이미지 푸시

```bash
docker push asia-northeast3-docker.pkg.dev/YOUR_PROJECT_ID/my-repo/python-ai-server:latest
```

## 6. Secret Manager 등록

처음이면 secret 생성:

```bash
printf 'sk-...\n' | gcloud secrets create openai-api-key --data-file=-
```

이미 있으면 새 버전 추가:

```bash
printf 'sk-...\n' | gcloud secrets versions add openai-api-key --data-file=-
```

## 7. Cloud Run 배포

```bash
gcloud run deploy python-ai-server \
  --image asia-northeast3-docker.pkg.dev/YOUR_PROJECT_ID/my-repo/python-ai-server:latest \
  --region asia-northeast3 \
  --update-secrets OPENAI_API_KEY=openai-api-key:latest
```

외부 공개가 필요할 때만 `--allow-unauthenticated`를 추가합니다.

## 8. Secret 접근 권한

배포 서비스 계정에 secret 조회 권한이 없으면 부여합니다.

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

## 메모

- 컨테이너 실행 명령은 `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}`입니다.
- Cloud Run은 `PORT` 환경변수를 자동으로 주입합니다.
- 이미지에는 `app`, `prompts`, `schemas`, `requirements.txt`만 복사됩니다.
