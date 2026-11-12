<?php
// ==== 出力の種類の宣言 ====
header('Content-Type: application/json; charset=utf-8');


// ==== DB接続とチェック ====
require_once __DIR__ . '/../config/database.php';

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'DB接続失敗'], JSON_UNESCAPED_UNICODE);
    exit;
}

$employees = $pdo->query(
    'SELECT employee_id, employee_name, department_name
    FROM employees
    ORDER BY employee_id'
)->fetchAll(PDO::FETCH_ASSOC);

$schedules = $pdo->query(
    'SELECT s.schedule_id, s.employee_id, s.status, s.detail, s.quantity,
            s.planned_start_date, s.planned_end_date,
            s.actual_start_date, s.actual_end_date,
            t.task_name, c.customer_name
    FROM schedules s
    JOIN tasks t          ON t.task_id = s.task_id
    LEFT JOIN orders o    ON o.order_id = s.order_id
    LEFT JOIN customers c ON c.customer_id = o.customer_id
    ORDER BY s.planned_start_date'
)->fetchAll(PDO::FETCH_ASSOC);

$purchaseOrders = $pdo->query(
    'SELECT p.purchase_orders_id, p.summary, p.quantity, p.arrival_date,
            sp.company_name
    FROM purchase_orders p
    JOIN suppliers sp ON sp.supplier_id = p.supplier_id
    ORDER BY p.arrival_date'
)->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'employees'       => $employees,
    'schedules'       => $schedules,
    'purchase_orders' => $purchaseOrders,
    'leaves'          => [],
], JSON_UNESCAPED_UNICODE);

