$course_name = $args[0]
$temp_folder = "temp"

$path_to_static_old = "$temp_folder/static"
$path_to_static_new = "$course_name/public"

$path_to_script_old = "$temp_folder/src/script.js"
$path_to_script_new = "$course_name/src/main.ts"

$path_to_css_old = "$temp_folder/src/style.css"
$path_to_css_new = "$course_name/src/style.css"


Write-Host "building $course_name..."


Expand-Archive -Force ./$course_name.zip -DestinationPath ./$temp_folder


Invoke-Expression "npm init @vitejs/app $course_name --template vanilla-ts"
Set-Location ./$course_name
Invoke-Expression "npm install"
Invoke-Expression "npm install three @types/three"
Remove-Item -LiteralPath "./src/vite-env.d.ts" -Force


Set-Location ../
if (Test-Path $path_to_static_old) {
    Move-Item -Path $path_to_static_old -Destination $path_to_static_new -force
}

if (Test-Path $path_to_script_old) {
    Move-Item -Path $path_to_script_old -Destination $path_to_script_new -force
}

if (Test-Path $path_to_css_old) {
    Move-Item -Path $path_to_css_old -Destination $path_to_css_new -force
}


Remove-Item -LiteralPath "./$temp_folder" -Force -Recurse
Remove-Item -LiteralPath "./$course_name.zip" -Force -Recurse


Write-Host "done!"
