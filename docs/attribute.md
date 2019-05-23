# attribute

This is a command that does not exist as a default command.

----

Enables you to get the value of an elements attributes.

> **Note:** When using `.attribute()` you should be aware about how Cypress [only retries the last command](https://docs.cypress.io/guides/core-concepts/retry-ability.html#Only-the-last-command-is-retried).

## Syntax

```javascript
.attribute(attribute)
.attribute(attribute, options)
```

## Usage

### :heavy_check_mark: Correct Usage

```javascript
cy.get('a').attribute('href')  // Yields the value of the `href` attribute
```

### :x: Incorrect Usage

```javascript
cy.attribute('foo')  // Errors, cannot be chained off 'cy'
cy.location().attribute('foo')  // Errors, 'location' does not yield DOM element
```

## Arguments

**> attribute** ***(String)***

The name of the attribute to be yielded by `.attribute()`

**> options** ***(Object)***

Pass in an options object to change the default behavior of `.attribute()`.

Option | Default | Description
--- | --- | ---
`timeout` | [`defaultCommandTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) | Time to wait for `.attribute()` to resolve before [timing out](https://docs.cypress.io/api/commands/then.html#Timeouts)
`log` | `false` | Displays the command in the [Command log](https://docs.cypress.io/guides/core-concepts/test-runner.html#Command-Log)
`strict` | `true` | Enforce that all subjects have the requested attribute

## Yields

* `.attribute()` yields the value of a subjects given attribute.
* `.attribute()` yields an array of the values of multiple subjects given attribute.

## Examples

### An alt attribute

```html
<img src='./images/tiger.jpg' alt='Teriffic tiger'>
```

```javascript
// yields "Teriffic Tiger"
cy.get('img').attribute('alt');
```

### Multiple subjects

```html
<input type="text">
<input type="submit">
```

```javascript
// yields [
//     "text",
//     "submit"
// ]
cy.get('input').attribute('type');
```

### Strict mode

Strict mode comes into play when using `.attribute()` with multiple subjects. By default strict mode is enabled.

```html
<a href="#" target="_blank">Amazing armadillo</a>
<a href="#">Everlasting eel</a>
```

#### Strict mode enabled

Throws an error, because some subjects don't have the `target` attribute.

```javascript
// Throws error: Expected all 2 elements to have attribute 'target', but never found it on 1 elements.
cy.get('a').attribute('target');
```

Yields two values because both subjects have the `href` attribute.

```javascript
// yields [
//     "#",
//     "#"
// ]
cy.get('a').attribute('href');
```

#### Strict mode disabled

Does not throw an error because it is possible to yield a value, even if not all subjects have a `target` attribute. Any subject that does not have the `target` attribute is simply ignored.

```javascript
// yields "_blank"
cy.get('a').attribute('target', { strict: false });
```

## Notes

### Empty attributes

`.attribute()` considers an empty attribute like below as existing, but empty.

```html
<p hidden>Catastrophic Cat</p>
```

```javascript
cy.get('p')
    .attribute('hidden')
    .should('exist')
    .should('be.empty');
```

## Rules

### Requirements

* `.attribute()` requires being chained off a command that yields DOM element(s).

### Assertions

* `.attribute()` will automatically retry until the attribute exist on the subject(s).
* `.attribute()` will automatically retry itself until assertions you've chained all pass.

### Timeouts

* `.attribute()` can time out waiting for a chained assertion to pass.

## Command Log

`.attribute()` will output to the command log.