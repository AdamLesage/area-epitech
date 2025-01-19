FROM mobiledevops/android-sdk-image:latest

WORKDIR /app

USER root

RUN apt-get update && \
    apt-get install -y nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Command to build the .apk
CMD ["/bin/sh", "-c", "npm install && npm run build-only && npx cap sync && cd /app/android/ && ./gradlew clean assembleRelease  && cp app/build/outputs/apk/release/app-release.apk /apk"]

