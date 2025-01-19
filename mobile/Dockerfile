FROM mobiledevops/android-sdk-image:latest

WORKDIR /app

USER root

# Command to build the .apk
CMD ["/bin/sh", "-c", "cd /app && npx cap sync && cd /android/ && ./gradlew clean assembleRelease  && cp app/build/outputs/apk/release/app-release.apk /apk"]
