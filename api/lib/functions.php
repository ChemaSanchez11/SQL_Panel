<?php

function encrypt($string){
    $ciphering = "AES-128-CTR";

    $iv_length = openssl_cipher_iv_length($ciphering);
    $options = 0;

    $encryption_iv = '1234567891011121';

    $encryption_key = 'mysql_panel';

    $encryption = openssl_encrypt($string, $ciphering,
        $encryption_key, $options, $encryption_iv);
    return $encryption;
}

function decrypt($encryption){
    $decryption_iv = '1234567891011121';
    $ciphering = "AES-128-CTR";
    $options = 0;

    $decryption_key = 'mysql_panel';

    $decryption=openssl_decrypt ($encryption, $ciphering,
        $decryption_key, $options, $decryption_iv);

    return $decryption;
}

function query_is_action($query) {
    $lowercaseQuery = strtolower($query);

    // Patrón de expresión regular para buscar cualquier acción distinta a SELECT
    $pattern = '/\b(insert\s+into|update|delete\s+from|replace\s+into|truncate\s+table|create\s+table|use|drop\s+table|create\s+database|drop\s+database)\b/i';

    // Verificar si la consulta coincide con el patrón
    if (preg_match($pattern, $lowercaseQuery)) {
        return true;
    }

    // Si no se encontró ninguna acción, se considera una consulta SELECT
    return false;
}