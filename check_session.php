<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
$pdo->exec('USE kingdom_network');
$stmt = $pdo->query("SHOW TABLES LIKE 'sessions'");
echo $stmt->fetch() ? "sessions table: EXISTS\n" : "sessions table: MISSING\n";

$stmt = $pdo->query("SHOW COLUMNS FROM sessions");
while ($col = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "  " . $col['Field'] . " (" . $col['Type'] . ")\n";
}
