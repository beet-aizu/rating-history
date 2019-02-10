<?php
header('Content-Type:application/json;charset=UTF-8');

if(isset($_GET["url"]) && preg_match("/^https?:/",$_GET["url"])){
    print file_get_contents($_GET["url"]);
}else{
    echo "error";
}
?>
