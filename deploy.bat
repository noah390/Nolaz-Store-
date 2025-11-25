@echo off
echo ========================================
echo    NOLAZ STORE - GITHUB DEPLOYMENT
echo ========================================
echo.

echo Initializing Git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Committing files...
git commit -m "Initial commit: Nolaz Store e-commerce website with shopping cart and admin panel"

echo.
echo Adding remote repository...
git remote add origin https://github.com/noah390/Nolaz-Store-.git

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your site will be available at:
echo https://noah390.github.io/Nolaz-Store-/home.html
echo.
echo Next steps:
echo 1. Go to https://github.com/noah390/Nolaz-Store-
echo 2. Click Settings ^> Pages
echo 3. Enable GitHub Pages from main branch
echo 4. Configure Google Sheets and Apps Script
echo.
pause