@echo off
setlocal

title ArogyaSutra - Zero-Knowledge Personal Health Record

echo ================================================================
echo       AROGYASUTRA - AI-Powered Personal Health Record
echo ================================================================
echo.

cd /d "%~dp0"

:: 1. Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 goto NoNode

echo [OK] Node.js detected:
node -v
echo.
goto CheckDeps

:NoNode
echo [ERROR] Node.js is not installed or not found in system PATH!
echo Please install Node.js from https://nodejs.org/
echo.
pause
exit /b 1

:CheckDeps
:: 2. Check dependencies
if not exist "node_modules\" goto InstallDeps
echo [OK] Dependencies verified: node_modules exists.
goto CheckEnv

:InstallDeps
echo [INFO] Dependencies not found. Running npm install...
echo Please wait, this may take a couple of minutes...
call npm install
if errorlevel 1 goto NpmError
echo [OK] Dependencies installed successfully.
echo.
goto CheckEnv

:NpmError
echo.
echo [ERROR] npm install encountered an error.
pause
exit /b 1

:CheckEnv
:: 3. Check environment configuration
if exist ".env.local" goto Launch
echo [INFO] Creating default .env.local configuration...
(
    echo # AWS Configuration
    echo NEXT_PUBLIC_AWS_REGION=ap-south-1
    echo APP_AWS_REGION=ap-south-1
    echo.
    echo # Cognito User Pools
    echo NEXT_PUBLIC_COGNITO_PATIENT_POOL_ID=ap-south-1_demo_patient_pool
    echo NEXT_PUBLIC_COGNITO_PATIENT_CLIENT_ID=demo_patient_client_id_ap_south_1
    echo NEXT_PUBLIC_COGNITO_DOCTOR_POOL_ID=ap-south-1_demo_doctor_pool
    echo NEXT_PUBLIC_COGNITO_DOCTOR_CLIENT_ID=demo_doctor_client_id_ap_south_1
    echo NEXT_PUBLIC_COGNITO_CLIENT_ID=demo_patient_client_id_ap_south_1
    echo.
    echo # Storage
    echo NEXT_PUBLIC_S3_BUCKET=arogyasutra-medical-docs
    echo NEXT_PUBLIC_HEALTHLAKE_DATASTORE_ID=
    echo.
    echo # AWS IAM Credentials
    echo APP_AWS_ACCESS_KEY_ID=
    echo APP_AWS_SECRET_ACCESS_KEY=
    echo.
    echo # KMS and Notifications
    echo KMS_KEY_ID=
    echo SNS_TOPIC_ARN=
    echo.
    echo # DynamoDB Tables
    echo DYNAMODB_AUDIT_TABLE=arogyasutra-audit-logs
    echo DYNAMODB_ACCESS_TABLE=arogyasutra-access-grants
    echo DYNAMODB_SESSION_TABLE=arogyasutra-sessions
    echo DYNAMODB_HEALTH_RECORDS_TABLE=arogyasutra-health-records
    echo DYNAMODB_CHECKUPS_TABLE=arogyasutra-checkups
    echo DYNAMODB_APPOINTMENTS_TABLE=arogyasutra-appointments
    echo.
    echo # Bedrock Models
    echo BEDROCK_MODEL_ID=us.amazon.nova-pro-v1:0
    echo KIMI_BEDROCK_MODEL=moonshotai.kimi-k2.5
) > .env.local
echo [OK] Created default .env.local.
echo.

:Launch
:: 4. Launch browser in background once server warms up
echo [INFO] Opening web browser at http://localhost:3000 ...
start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:3000"

:: 5. Start Next.js development server
echo [INFO] Starting Next.js development server...
echo Press Ctrl+C in this terminal to stop the server anytime.
echo.
call npm run dev

if errorlevel 1 (
    echo.
    echo [NOTICE] Development server stopped or encountered an issue.
    pause
)
