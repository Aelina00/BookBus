@echo off
echo 🚀 Building Karakol Bus Android App...

REM Проверяем, установлен ли npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm не установлен
    pause
    exit /b 1
)

REM Устанавливаем зависимости
echo 📦 Устанавливаем зависимости...
call npm install

REM Собираем веб-версию
echo 🔨 Собираем веб-версию...
call npm run build

REM Синхронизируем с Capacitor
echo 🔄 Синхронизируем с Capacitor...
call npx cap sync android

REM Открываем Android Studio для финальной сборки
echo 📱 Открываем Android Studio...
call npx cap open android

echo.
echo ℹ️  В Android Studio:
echo    1. Build ^> Generate Signed Bundle / APK
echo    2. Выберите APK или Bundle
echo    3. Создайте keystore или используйте существующий
echo    4. Соберите Release версию
echo.
pause