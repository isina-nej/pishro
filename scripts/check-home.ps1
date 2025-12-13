$resp = Invoke-WebRequest 'http://localhost:3000' -UseBasicParsing
$c = $resp.Content
if ($c -match 'پیشرو سرمایه') { Write-Output 'HERO_FOUND' } else { Write-Output 'HERO_NOT_FOUND' }
if ($c -match '/images/home/slide-1.jpg') { Write-Output 'SLIDE1_IMAGE_FOUND' } else { Write-Output 'SLIDE1_IMAGE_NOT_FOUND' }
