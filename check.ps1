Add-Type -AssemblyName System.Drawing;
$img = [System.Drawing.Image]::FromFile("C:\Users\Arnab Das\Desktop\portfolio\src\lanyardphoto.jpg");
Write-Output "$($img.Width)x$($img.Height)";
$img.Dispose();
