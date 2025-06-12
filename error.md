Running 'gradlew :app:assembleRelease' in /home/expo/workingdir/build/android
Downloading https://services.gradle.org/distributions/gradle-8.13-bin.zip
10%.
20%.
30%.
40%.
50%.
60%.
70%.
80%.
90%
100%
Welcome to Gradle 8.13!
Here are the highlights of this release:
 - Daemon JVM auto-provisioning
- Enhancements for Scala plugin and JUnit testing
- Improvements for build authors and plugin developers
For more details see https://docs.gradle.org/8.13/release-notes.html
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.13/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build
> Configure project :expo-gradle-plugin:expo-autolinking-plugin-shared
w: file:///home/expo/workingdir/build/node_modules/expo-modules-autolinking/android/expo-gradle-plugin/expo-autolinking-plugin-shared/build.gradle.kts:32:9: The expression is unused
> Task :gradle-plugin:settings-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :gradle-plugin:shared:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:checkKotlinGradlePluginConfigurationErrors
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:checkKotlinGradlePluginConfigurationErrors
> Task :gradle-plugin:settings-plugin:pluginDescriptors
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:pluginDescriptors
> Task :gradle-plugin:settings-plugin:processResources
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:processResources
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:processResources NO-SOURCE
> Task :gradle-plugin:shared:processResources NO-SOURCE
> Task :gradle-plugin:shared:compileKotlin
> Task :gradle-plugin:shared:compileJava NO-SOURCE
> Task :gradle-plugin:shared:classes UP-TO-DATE
> Task :gradle-plugin:shared:jar
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:compileKotlin
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:compileJava NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:classes UP-TO-DATE
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:jar
> Task :gradle-plugin:settings-plugin:compileKotlin
> Task :gradle-plugin:settings-plugin:compileJava NO-SOURCE
> Task :gradle-plugin:settings-plugin:classes
> Task :gradle-plugin:settings-plugin:jar
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:compileKotlin
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:compileJava NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:classes
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:jar
> Task :expo-module-gradle-plugin:checkKotlinGradlePluginConfigurationErrors
> Task :expo-gradle-plugin:expo-autolinking-plugin:checkKotlinGradlePluginConfigurationErrors
> Task :gradle-plugin:react-native-gradle-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-module-gradle-plugin:pluginDescriptors
> Task :expo-module-gradle-plugin:processResources
> Task :expo-gradle-plugin:expo-autolinking-plugin:pluginDescriptors
> Task :expo-gradle-plugin:expo-autolinking-plugin:processResources
> Task :gradle-plugin:react-native-gradle-plugin:pluginDescriptors
> Task :gradle-plugin:react-native-gradle-plugin:processResources
> Task :expo-gradle-plugin:expo-autolinking-plugin:compileKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-autolinking/android/expo-gradle-plugin/expo-autolinking-plugin/src/main/kotlin/expo/modules/plugin/ExpoAutolinkingPlugin.kt:29:71 Name shadowed: project
> Task :expo-gradle-plugin:expo-autolinking-plugin:compileJava NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-plugin:classes
> Task :expo-gradle-plugin:expo-autolinking-plugin:jar
> Task :gradle-plugin:react-native-gradle-plugin:compileKotlin
> Task :gradle-plugin:react-native-gradle-plugin:compileJava
NO-SOURCE
> Task :gradle-plugin:react-native-gradle-plugin:classes
> Task :gradle-plugin:react-native-gradle-plugin:jar
> Task :expo-module-gradle-plugin:compileKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/expo-module-gradle-plugin/src/main/kotlin/expo/modules/plugin/android/AndroidLibraryExtension.kt:9:24 'targetSdk: Int?' is deprecated. Will be removed from library DSL in v9.0. Use testOptions.targetSdk or/and lint.targetSdk instead
> Task :expo-module-gradle-plugin:compileJava
NO-SOURCE
> Task :expo-module-gradle-plugin:classes
> Task :expo-module-gradle-plugin:jar
> Configure project :
[32m[ExpoRootProject][0m Using the following versions:
  - buildTools:  [32m35.0.0[0m
  - minSdk:      [32m24[0m
  - compileSdk:  [32m35[0m
  - targetSdk:   [32m35[0m
  - ndk:         [32m27.1.12297006[0m
  - kotlin:      [32m2.0.21[0m
  - ksp:         [32m2.0.21-1.0.28[0m
> Configure project :app
Checking the license for package NDK (Side by side) 27.1.12297006 in /home/expo/Android/Sdk/licenses
License for package NDK (Side by side) 27.1.12297006 accepted.
Preparing "Install NDK (Side by side) 27.1.12297006 v.27.1.12297006".
"Install NDK (Side by side) 27.1.12297006 v.27.1.12297006" ready.
Installing NDK (Side by side) 27.1.12297006 in /home/expo/Android/Sdk/ndk/27.1.12297006
"Install NDK (Side by side) 27.1.12297006 v.27.1.12297006" complete.
"Install NDK (Side by side) 27.1.12297006 v.27.1.12297006" finished.
> Configure project :expo
Using expo modules
- [32mexpo-constants[0m (17.1.6)
  - [32mexpo-file-system[0m (18.1.10)
  - [32mexpo-image-loader[0m (4.7.0)
  - [32mexpo-image-picker[0m (15.0.7)
- [32mexpo-modules-core[0m (2.4.0)
- [32mexpo-splash-screen[0m (0.29.24)
- [33m[📦][0m [32mexpo-asset[0m (11.1.5)
- [33m[📦][0m [32mexpo-font[0m (13.3.1)
  - [33m[📦][0m [32mexpo-keep-awake[0m (14.1.4)
  - [33m[📦][0m [32mexpo-linear-gradient[0m (14.1.5)
> Configure project :react-native-reanimated
Android gradle plugin: 8.8.2
Gradle: 8.13
> Task :expo-file-system:preBuild UP-TO-DATE
> Task :expo-file-system:preReleaseBuild UP-TO-DATE
> Task :expo-file-system:writeReleaseAarMetadata
> Task :expo-image-loader:preBuild UP-TO-DATE
> Task :expo-image-loader:preReleaseBuild UP-TO-DATE
> Task :expo-image-loader:writeReleaseAarMetadata
> Task :expo-image-picker:preBuild UP-TO-DATE
> Task :expo-image-picker:preReleaseBuild UP-TO-DATE
> Task :expo-image-picker:writeReleaseAarMetadata
> Task :expo-modules-core:preBuild UP-TO-DATE
> Task :expo-modules-core:preReleaseBuild UP-TO-DATE
> Task :app:buildKotlinToolingMetadata
> Task :app:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-modules-core:writeReleaseAarMetadata
> Task :expo-splash-screen:preBuild UP-TO-DATE
> Task :expo-splash-screen:preReleaseBuild UP-TO-DATE
> Task :expo-splash-screen:writeReleaseAarMetadata
> Task :expo-constants:createExpoConfig
The NODE_ENV environment variable is required but was not specified. Ensure the project is bundled with Expo CLI or NODE_ENV is set. Using only .env.local and .env
> Task :expo-constants:preBuild
> Task :expo-constants:preReleaseBuild
> Task :expo-constants:writeReleaseAarMetadata
> Task :app:generateAutolinkingNewArchitectureFiles
> Task :app:generateAutolinkingPackageList
> Task :app:generateCodegenSchemaFromJavaScript SKIPPED
> Task :app:generateCodegenArtifactsFromSchema SKIPPED
> Task :app:preBuild
> Task :app:preReleaseBuild
> Task :app:generateReleaseBuildConfig
> Task :expo:generatePackagesList
> Task :expo:preBuild
> Task :expo:preReleaseBuild
> Task :expo:writeReleaseAarMetadata
> Task :react-native-reanimated:assertMinimalReactNativeVersionTask SKIPPED
> Task :react-native-async-storage_async-storage:generateCodegenSchemaFromJavaScript
> Task :react-native-gesture-handler:generateCodegenSchemaFromJavaScript
> Task :react-native-picker_picker:generateCodegenSchemaFromJavaScript
> Task :react-native-reanimated:generateCodegenSchemaFromJavaScript
> Task :react-native-gesture-handler:generateCodegenArtifactsFromSchema
> Task :react-native-gesture-handler:preBuild
> Task :react-native-gesture-handler:preReleaseBuild
> Task :react-native-gesture-handler:writeReleaseAarMetadata
> Task :react-native-async-storage_async-storage:generateCodegenArtifactsFromSchema
> Task :react-native-async-storage_async-storage:preBuild
> Task :react-native-async-storage_async-storage:preReleaseBuild
> Task :react-native-picker_picker:generateCodegenArtifactsFromSchema
> Task :react-native-picker_picker:preBuild
> Task :react-native-picker_picker:preReleaseBuild
> Task :react-native-async-storage_async-storage:writeReleaseAarMetadata
> Task :react-native-picker_picker:writeReleaseAarMetadata
> Task :react-native-reanimated:generateCodegenArtifactsFromSchema
> Task :react-native-reanimated:prepareReanimatedHeadersForPrefabs
> Task :react-native-safe-area-context:generateCodegenSchemaFromJavaScript
> Task :react-native-reanimated:prepareWorkletsHeadersForPrefabs
> Task :react-native-reanimated:preBuild
> Task :react-native-reanimated:preReleaseBuild
> Task :react-native-reanimated:writeReleaseAarMetadata
> Task :expo:generateReleaseResValues
> Task :expo:generateReleaseResources
> Task :expo:packageReleaseResources
> Task :expo-constants:generateReleaseResValues
> Task :expo-constants:generateReleaseResources
> Task :react-native-screens:generateCodegenSchemaFromJavaScript
> Task :expo-constants:packageReleaseResources
> Task :expo-file-system:generateReleaseResValues
> Task :expo-file-system:generateReleaseResources
> Task :expo-file-system:packageReleaseResources
> Task :expo-image-loader:generateReleaseResValues
> Task :expo-image-loader:generateReleaseResources
> Task :react-native-safe-area-context:generateCodegenArtifactsFromSchema
> Task :react-native-safe-area-context:preBuild
> Task :react-native-safe-area-context:preReleaseBuild
> Task :expo-image-loader:packageReleaseResources
> Task :react-native-safe-area-context:writeReleaseAarMetadata
> Task :expo-image-picker:generateReleaseResValues
> Task :expo-modules-core:generateReleaseResValues
> Task :expo-image-picker:generateReleaseResources
> Task :expo-modules-core:generateReleaseResources
> Task :expo-modules-core:packageReleaseResources
> Task :expo-image-picker:packageReleaseResources
> Task :expo-splash-screen:generateReleaseResValues
> Task :react-native-async-storage_async-storage:generateReleaseResValues
> Task :expo-splash-screen:generateReleaseResources
> Task :react-native-async-storage_async-storage:generateReleaseResources
> Task :react-native-async-storage_async-storage:packageReleaseResources
> Task :react-native-gesture-handler:generateReleaseResValues
> Task :react-native-gesture-handler:generateReleaseResources
> Task :expo-splash-screen:packageReleaseResources
> Task :react-native-gesture-handler:packageReleaseResources
> Task :react-native-picker_picker:generateReleaseResValues
> Task :react-native-reanimated:generateReleaseResValues
> Task :react-native-picker_picker:generateReleaseResources
> Task :react-native-reanimated:generateReleaseResources
> Task :react-native-reanimated:packageReleaseResources
> Task :react-native-safe-area-context:generateReleaseResValues
> Task :react-native-picker_picker:packageReleaseResources
> Task :react-native-safe-area-context:generateReleaseResources
> Task :expo:extractDeepLinksRelease
> Task :react-native-safe-area-context:packageReleaseResources
> Task :react-native-screens:generateCodegenArtifactsFromSchema
> Task :react-native-screens:preBuild
> Task :react-native-screens:preReleaseBuild
> Task :expo-constants:extractDeepLinksRelease
> Task :react-native-screens:generateReleaseResValues
> Task :react-native-screens:writeReleaseAarMetadata
> Task :react-native-screens:generateReleaseResources
> Task :react-native-screens:packageReleaseResources
> Task :expo-file-system:extractDeepLinksRelease
> Task :expo-constants:processReleaseManifest
> Task :expo:processReleaseManifest
> Task :expo-file-system:processReleaseManifest
/home/expo/workingdir/build/node_modules/expo-file-system/android/src/main/AndroidManifest.xml:6:9-8:20 Warning:
	provider#expo.modules.filesystem.FileSystemFileProvider@android:authorities was tagged at AndroidManifest.xml:6 to replace other declarations but no other declaration present
> Task :expo-image-loader:extractDeepLinksRelease
> Task :expo-image-picker:extractDeepLinksRelease
> Task :expo-modules-core:extractDeepLinksRelease
> Task :expo-image-loader:processReleaseManifest
> Task :expo-splash-screen:extractDeepLinksRelease
> Task :expo-modules-core:processReleaseManifest
/home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/AndroidManifest.xml:8:9-11:45 Warning:
	meta-data#com.facebook.soloader.enabled@android:value was tagged at AndroidManifest.xml:8 to replace other declarations but no other declaration present
> Task :expo-image-picker:processReleaseManifest
> Task :react-native-async-storage_async-storage:extractDeepLinksRelease
> Task :react-native-gesture-handler:extractDeepLinksRelease
> Task :react-native-async-storage_async-storage:processReleaseManifest
package="com.reactnativecommunity.asyncstorage" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/main/AndroidManifest.xml.
Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
Recommendation: remove package="com.reactnativecommunity.asyncstorage" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/main/AndroidManifest.xml.
> Task :expo-splash-screen:processReleaseManifest
> Task :react-native-picker_picker:extractDeepLinksRelease
> Task :react-native-gesture-handler:processReleaseManifest
> Task :react-native-safe-area-context:extractDeepLinksRelease
> Task :react-native-reanimated:extractDeepLinksRelease
> Task :react-native-safe-area-context:processReleaseManifest
package="com.th3rdwave.safeareacontext" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/AndroidManifest.xml.
Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
Recommendation: remove package="com.th3rdwave.safeareacontext" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/AndroidManifest.xml.
> Task :react-native-reanimated:processReleaseManifest
> Task :react-native-picker_picker:processReleaseManifest
package="com.reactnativecommunity.picker" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-picker/picker/android/src/main/AndroidManifest.xml.
Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
Recommendation: remove package="com.reactnativecommunity.picker" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-picker/picker/android/src/main/AndroidManifest.xml.
> Task :react-native-screens:extractDeepLinksRelease
> Task :react-native-screens:processReleaseManifest
> Task :expo:compileReleaseLibraryResources
> Task :expo-constants:compileReleaseLibraryResources
> Task :expo-file-system:compileReleaseLibraryResources
> Task :expo-constants:parseReleaseLocalResources
> Task :expo-file-system:parseReleaseLocalResources
> Task :expo:parseReleaseLocalResources
> Task :expo:generateReleaseRFile
> Task :expo-file-system:generateReleaseRFile
> Task :expo-constants:generateReleaseRFile
> Task :expo-modules-core:compileReleaseLibraryResources
> Task :expo-image-loader:compileReleaseLibraryResources
> Task :expo-image-picker:compileReleaseLibraryResources
> Task :expo-image-loader:parseReleaseLocalResources
> Task :expo-modules-core:parseReleaseLocalResources
> Task :expo-image-picker:parseReleaseLocalResources
> Task :expo-modules-core:generateReleaseRFile
> Task :expo-image-loader:generateReleaseRFile
> Task :expo-splash-screen:compileReleaseLibraryResources
> Task :react-native-async-storage_async-storage:compileReleaseLibraryResources
> Task :expo-image-picker:generateReleaseRFile
> Task :react-native-gesture-handler:compileReleaseLibraryResources
> Task :react-native-async-storage_async-storage:parseReleaseLocalResources
> Task :react-native-gesture-handler:parseReleaseLocalResources
> Task :expo-splash-screen:parseReleaseLocalResources
> Task :react-native-gesture-handler:generateReleaseRFile
> Task :react-native-async-storage_async-storage:generateReleaseRFile
> Task :expo-splash-screen:generateReleaseRFile
> Task :react-native-safe-area-context:compileReleaseLibraryResources
> Task :react-native-reanimated:compileReleaseLibraryResources
> Task :react-native-picker_picker:parseReleaseLocalResources
> Task :react-native-reanimated:parseReleaseLocalResources
> Task :react-native-picker_picker:compileReleaseLibraryResources
> Task :react-native-safe-area-context:parseReleaseLocalResources
> Task :react-native-reanimated:generateReleaseRFile
> Task :react-native-picker_picker:generateReleaseRFile
> Task :expo:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-safe-area-context:generateReleaseRFile
> Task :expo-constants:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo:generateReleaseBuildConfig
> Task :expo-constants:generateReleaseBuildConfig
> Task :expo-modules-core:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-modules-core:generateReleaseBuildConfig
> Task :react-native-screens:parseReleaseLocalResources
> Task :app:createBundleReleaseJsAndAssets
Starting Metro Bundler
> Task :react-native-screens:compileReleaseLibraryResources
> Task :react-native-screens:generateReleaseRFile
> Task :expo-file-system:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-file-system:generateReleaseBuildConfig
> Task :expo-constants:javaPreCompileRelease
> Task :expo-image-loader:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-file-system:javaPreCompileRelease
> Task :expo-image-picker:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-image-loader:generateReleaseBuildConfig
> Task :expo-image-picker:generateReleaseBuildConfig
> Task :expo-image-loader:javaPreCompileRelease
> Task :expo-splash-screen:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-image-picker:javaPreCompileRelease
> Task :expo-splash-screen:generateReleaseBuildConfig
> Task :expo:javaPreCompileRelease
> Task :expo-splash-screen:javaPreCompileRelease
> Task :react-native-gesture-handler:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-async-storage_async-storage:generateReleaseBuildConfig
> Task :react-native-async-storage_async-storage:javaPreCompileRelease
> Task :react-native-gesture-handler:generateReleaseBuildConfig
> Task :react-native-reanimated:generateReleaseBuildConfig
> Task :react-native-reanimated:javaPreCompileRelease
> Task :react-native-reanimated:packageNdkLibs NO-SOURCE
> Task :app:createBundleReleaseJsAndAssets
Android Bundled 2190ms index.js (1236 modules)
Writing bundle output to: /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle
Writing sourcemap output to: /home/expo/workingdir/build/android/app/build/intermediates/sourcemaps/react/release/index.android.bundle.packager.map
Copying 26 asset files
Done writing bundle output
Done writing sourcemap output
> Task :react-native-async-storage_async-storage:compileReleaseJavaWithJavac
> Task :react-native-reanimated:compileReleaseJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/javaPackage/java/com/reactnativecommunity/asyncstorage/AsyncStoragePackage.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: Some input files use unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
> Task :expo-modules-core:javaPreCompileRelease
> Task :react-native-async-storage_async-storage:bundleLibCompileToJarRelease
> Task :react-native-reanimated:bundleLibCompileToJarRelease
> Task :react-native-gesture-handler:javaPreCompileRelease
> Task :react-native-picker_picker:generateReleaseBuildConfig
> Task :react-native-picker_picker:javaPreCompileRelease
> Task :react-native-picker_picker:compileReleaseJavaWithJavac
> Task :react-native-picker_picker:bundleLibCompileToJarRelease
> Task :react-native-safe-area-context:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-safe-area-context:generateReleaseBuildConfig
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
> Task :react-native-safe-area-context:compileReleaseKotlin
w: file:///home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/java/com/th3rdwave/safeareacontext/SafeAreaView.kt:59:23 'val uiImplementation: UIImplementation!' is deprecated. Deprecated in Java.
> Task :react-native-safe-area-context:javaPreCompileRelease
> Task :react-native-safe-area-context:compileReleaseJavaWithJavac
> Task :react-native-safe-area-context:bundleLibCompileToJarRelease
> Task :react-native-screens:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :react-native-screens:generateReleaseBuildConfig
> Task :expo-modules-core:compileReleaseKotlin
> Task :react-native-gesture-handler:compileReleaseKotlin
> Task :react-native-gesture-handler:compileReleaseJavaWithJavac
> Task :react-native-gesture-handler:bundleLibCompileToJarRelease
> Task :react-native-screens:javaPreCompileRelease
> Task :expo:extractProguardFiles
> Task :expo-constants:extractProguardFiles
> Task :expo-modules-core:extractProguardFiles
> Task :expo-modules-core:prepareLintJarForPublish
> Task :expo-constants:prepareLintJarForPublish
> Task :expo-file-system:extractProguardFiles
> Task :expo-file-system:prepareLintJarForPublish
> Task :expo-image-loader:extractProguardFiles
> Task :expo-image-loader:prepareLintJarForPublish
> Task :expo-image-picker:extractProguardFiles
> Task :expo-image-picker:prepareLintJarForPublish
> Task :expo-splash-screen:extractProguardFiles
> Task :expo-splash-screen:prepareLintJarForPublish
> Task :expo:prepareLintJarForPublish
> Task :react-native-async-storage_async-storage:bundleLibRuntimeToJarRelease
> Task :react-native-async-storage_async-storage:processReleaseJavaRes NO-SOURCE
> Task :react-native-async-storage_async-storage:createFullJarRelease
> Task :react-native-async-storage_async-storage:extractProguardFiles
> Task :app:checkReleaseAarMetadata
> Task :app:generateReleaseResValues
> Task :app:mapReleaseSourceSetPaths
> Task :app:generateReleaseResources
> Task :app:mergeReleaseResources FAILED
> Task :react-native-async-storage_async-storage:generateReleaseLintModel
> Task :react-native-screens:compileReleaseKotlin
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/CustomToolbar.kt:41:33 'class FrameCallback : Choreographer.FrameCallback' is deprecated. Use Choreographer.FrameCallback instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/CustomToolbar.kt:42:18 'class FrameCallback : Choreographer.FrameCallback' is deprecated. Use Choreographer.FrameCallback instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/RNScreensPackage.kt:66:17 'constructor(name: String, className: String, canOverrideExistingModule: Boolean, needsEagerInit: Boolean, hasConstants: Boolean, isCxxModule: Boolean, isTurboModule: Boolean): ReactModuleInfo' is deprecated. This constructor is deprecated and will be removed in the future. Use ReactModuleInfo(String, String, boolean, boolean, boolean, boolean)].
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/Screen.kt:48:77 Unchecked cast of '(androidx.coordinatorlayout.widget.CoordinatorLayout.Behavior<android.view.View!>?..androidx.coordinatorlayout.widget.CoordinatorLayout.Behavior<*>?)' to 'com.google.android.material.bottomsheet.BottomSheetBehavior<com.swmansion.rnscreens.Screen>'.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenContainer.kt:33:33 'class FrameCallback : Choreographer.FrameCallback' is deprecated. Use Choreographer.FrameCallback instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenContainer.kt:34:18 'class FrameCallback : Choreographer.FrameCallback' is deprecated. Use Choreographer.FrameCallback instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:216:31 'var targetElevation: Float' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:219:13 'fun setHasOptionsMenu(p0: Boolean): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:379:18 This declaration overrides a deprecated member but is not marked as deprecated itself. Please add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:386:22 'fun onPrepareOptionsMenu(p0: Menu): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:389:18 This declaration overrides a deprecated member but is not marked as deprecated itself. Please add the '@Deprecated' annotation or suppress the diagnostic.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:394:22 'fun onCreateOptionsMenu(p0: Menu, p1: MenuInflater): Unit' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfigViewManager.kt:7:8 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfigViewManager.kt:210:9 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfigViewManager.kt:212:13 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfigViewManager.kt:214:13 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:7:8 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:382:48 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:383:49 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:384:45 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:385:52 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:386:48 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:387:51 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:388:56 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:389:57 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:390:51 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:55:42 'fun replaceSystemWindowInsets(p0: Int, p1: Int, p2: Int, p3: Int): WindowInsetsCompat' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:56:39 'val systemWindowInsetLeft: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:58:39 'val systemWindowInsetRight: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:59:39 'val systemWindowInsetBottom: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:98:53 'var statusBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:109:48 'var statusBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:112:32 'var statusBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:208:72 'var navigationBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:214:16 'var navigationBarColor: Int' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:5:8 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:142:9 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:144:13 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:146:13 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:148:13 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:150:13 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:152:13 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:154:13 'class MapBuilder : Any' is deprecated. Deprecated in Java.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:7:8 'object ReactFeatureFlags : Any' is deprecated. Use com.facebook.react.internal.featureflags.ReactNativeFeatureFlags instead.
w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:25:13 'object ReactFeatureFlags : Any' is deprecated. Use com.facebook.react.internal.featureflags.ReactNativeFeatureFlags instead.
> Task :expo-modules-core:compileReleaseKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/java/expo/modules/apploader/AppLoaderProvider.kt:34:52 Unchecked cast of 'java.lang.Class<*>!' to 'java.lang.Class<out expo.modules.apploader.HeadlessAppLoader>'.
[Incubating] Problems report is available at: file:///home/expo/workingdir/build/android/build/reports/problems/problems-report.html
Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.
You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.
For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.
229 actionable tasks: 229 executed
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ':app:mergeReleaseResources'.
> A failure occurred while executing com.android.build.gradle.internal.res.Aapt2CompileRunnable
   > Android resource compilation failed
     ERROR: /home/expo/workingdir/build/android/app/build/generated/res/createBundleReleaseJsAndAssets/drawable-mdpi/assets_logo.png: AAPT: error: file failed to compile.
         
* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.
BUILD FAILED in 3m 25s
Error: Gradle build failed with unknown error. See logs for the "Run gradlew" phase for more information.