## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `jest-runner-phpunit`

```bash
yarn add --dev jest jest-runner-phpunit

# or with NPM

npm install --save-dev jest jest-runner-phpunit

```

### Add it to your Jest config

#### Standalone

In your `package.json`
```json
{
  "jest": {
    "runner": "jest-runner-phpunit",
    "displayName": "phpunit",
    "moduleFileExtensions": ["php"],
    "testMatch": ["<rootDir>/tests/**/*Test.php"]
  }
}
```

Or in `jest.config.js`
```js
module.exports = {
  runner: 'jest-runner-phpunit',
  "displayName": "phpunit",
  "moduleFileExtensions": ["php"],
  testMatch: ['<rootDir>/tests/**/*Test.php'],
}
```

Please update `testMatch` to match your project folder structure

#### Alongside other runners

It is recommended to use the [`projects`](https://facebook.github.io/jest/docs/en/configuration.html#projects-array-string-projectconfig) configuration option to run multiple Jest runners simultaneously.

If you are using Jest <22.0.5, you can use multiple Jest configuration files and supply the paths to those files in the `projects` option. For example:

```js
// jest-test.config.js
module.exports = {
  // your Jest test options
  displayName: 'test'
}

// jest-phpunit.config.js
module.exports = {
  // your jest-runner-phpunit options
  runner: 'jest-runner-phpunit',
  displayName: "phpunit",
  moduleFileExtensions: ["php"],
  testMatch: ['<rootDir>/tests/**/*Test.php']
}
```

In your `package.json`:

```json
{
  "jest": {
    "projects": [
      "<rootDir>/jest-test.config.js",
      "<rootDir>/jest-phpunit.config.js"
    ]
  }
}
```

Or in `jest.config.js`:

```js
module.exports = {
  projects: [
    '<rootDir>/jest-test.config.js',
    '<rootDir>/jest-phpunit.config.js'
  ]
}
```

If you are using Jest >=22.0.5, you can supply an array of project configuration objects instead. In your `package.json`:

```json
{
  "jest": {
    "projects": [
      {
        "displayName": "test"
      },
      {
        "runner": "jest-runner-phpunit",
        "displayName": "phpunit",
        "moduleFileExtensions": ["php"],
        "testMatch": ["<rootDir>/tests/**/*Test.php"]
      }
    ]
  }
}
```

Or in `jest.config.js`:

```js
module.exports = {
  projects: [
    {
      displayName: 'test'
    },
    {
      runner: 'jest-runner-phpunit',
      displayName: "phpunit",
      moduleFileExtensions: ["php"],
      testMatch: ['<rootDir>/tests/**/*Test.php']
    }
  ]
}
```

### Run Jest
```bash
yarn jest
```
