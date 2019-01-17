<?php

namespace Olyckne;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    public function testItWorks()
    {
        $this->assertTrue(true);
    }

    public function testItFails()
    {
        $this->assertTrue(false);
    }

    /**
     * @dataProvider exampleDataProvider
     */
    public function testWithDataProvider($actual, $expected)
    {
        $this->assertSame($actual, $expected);
    }

    public function exampleDataProvider()
    {
        return [
            [true, true],
            [false, false],
            [1, 1],
            ['example', 'example'],
        ];
    }

    /**
     * @dataProvider exampleSecondDataProvider
     */
    public function testWithAnotherDataProvider($actual, $expected)
    {
        $this->assertSame($actual, $expected);
    }

    public function exampleSecondDataProvider()
    {
        return [
            [true, true],
        ];
    }
}
