<?php

declare(strict_types=1);

// Runs the shared test cases (spec/badge-vectors.json) against TrustList\Badge. Exit code 0 when all pass.
require __DIR__ . '/../src/Badge.php';

use TrustList\Badge;

$v = json_decode((string) file_get_contents(__DIR__ . '/../../../spec/badge-vectors.json'), true);
$fail = 0;
foreach ($v['valid'] as $i => $c) {
    foreach (['rankingUrl' => 'rankingUrl', 'badgeUrl' => 'badgeUrl', 'verifyUrl' => 'verifyUrl', 'badgeHtml' => 'html'] as $key => $fn) {
        $got = Badge::$fn($c['input']);
        if ($got !== $c[$key]) {
            $fail++;
            echo "valid[$i] $fn\n got  $got\n want {$c[$key]}\n";
        }
    }
}
foreach ($v['invalid'] as $i => $c) {
    try {
        Badge::html($c['input']);
        $fail++;
        echo "invalid[$i]: no error\n";
    } catch (\InvalidArgumentException $e) {
        // expected
    }
}
echo $fail === 0 ? "all passed\n" : "$fail failed\n";
exit($fail === 0 ? 0 : 1);
