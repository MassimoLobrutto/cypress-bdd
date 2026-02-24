param (
    [string]$tag, 
    [string]$configfile,    
    [string]$browser,
    [string]$path
)

echo "Hello World"

$str="@"

$new_tag=$str + $tag
Write-Output $new_tag
Write-Output $configfile
Write-Output $browser
Write-Output $path
cd $path
ls 
node ./node_modules/cypress/bin/cypress run --env tags="$new_tag" --config-file $configfile --browser $browser
