<?php
/**
 * cart-count.php
 * Returns the current WHMCS cart item count as JSON.
 * Reads the shared PHP session used by WHMCS.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('X-Content-Type-Options: nosniff');

/* Start session if not already started by WHMCS */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$count = 0;

/* WHMCS stores cart items in $_SESSION['cart']['products'] */
if (isset($_SESSION['cart']['products']) && is_array($_SESSION['cart']['products'])) {
    $count = count($_SESSION['cart']['products']);
} elseif (isset($_SESSION['cart']) && is_array($_SESSION['cart'])) {
    $count = count($_SESSION['cart']);
}

echo json_encode(['ok' => true, 'count' => $count]);
