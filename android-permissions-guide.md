# 안드로이드 권한 설정 안내

## 결론부터
이 앱은 카메라를 **"기존 카메라 앱을 호출"하는 방식**(`<input type="file" capture>`)으로 사용하고,
사진/PDF 저장도 **브라우저 표준 다운로드 기능**을 사용합니다.
안드로이드 공식 문서에 따르면 이 방식은 **CAMERA 권한이나 저장소 권한을 앱이 별도로 요청할 필요가 없습니다.**
(출처: Android Developers – "If you are using the camera by invoking an existing camera app,
your application does not need to request this permission.")

즉, PWABuilder가 기본으로 만들어주는 AndroidManifest.xml(인터넷 권한만 포함)에
아무것도 추가하지 않아도 카메라 촬영·다운로드가 대부분 정상 동작할 가능성이 높습니다.

## 그래도 명시적으로 넣고 싶다면
PWABuilder에서 "Package for Stores → Android"로 프로젝트를 생성하면
`app/src/main/AndroidManifest.xml` 파일이 만들어집니다. 이 파일을 열어
`<application>` 태그 **바로 위쪽**에 아래 줄을 추가하세요.

```xml
<uses-permission android:name="android.permission.CAMERA"/>
<uses-feature android:name="android.hardware.camera" android:required="false"/>

<!-- 구형 안드로이드(9 이하) 호환용. 최신 기기에서는 사실상 불필요 -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="28"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
    android:maxSdkVersion="28"/>
```

- `android:required="false"`로 해두면 카메라가 없는 기기(예: 일부 태블릿)에서도 스토어에 노출됩니다.
- `WRITE_EXTERNAL_STORAGE`는 Android 9(API 28) 이하에서만 의미가 있어 `maxSdkVersion="28"`로 제한해뒀습니다.

## 구글 플레이 등록 시 참고
스토어 등록 과정의 "데이터 안전(Data Safety)" 설문에서
"카메라를 사용합니다"에 체크하시면 됩니다 (사진은 기기 안에서만 처리되고 외부로 전송되지 않는다고 안내하시면 됩니다).
