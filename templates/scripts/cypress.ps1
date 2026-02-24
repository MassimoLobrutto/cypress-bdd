param (
    [string]$tag, 
    [string]$configfile,    
    [string]$browser
)


Write-Output $tag
Write-Output $configfile
Write-Output $browser

node ./node_modules/cypress/bin/cypress run --env tags="$tag" --config-file $configfile --browser $browser