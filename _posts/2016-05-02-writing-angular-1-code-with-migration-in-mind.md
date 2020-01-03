---
layout: post
title: Writing Angular 1 Code with Migration in Mind
date: 2016-05-02
draft: true
comments: true
---
As typical for most projects, frameworks and libraries are chosen not least by
their stability and maturity. Which is good, after all you want a project's life
span to be as long as possible while keeping maintenance and migrations at bay.

Sometimes, however, choosing the older mature version of a framework or library
might not be such a great idea, even if the current version is not yet stable.
One reason to go for the current version from the start is to avoid later
migration that ensues if the current version comes with breaking changes or
fundamental concepts are altered.

<!--more-->

## Context

This is the case for a company-internal project I have been working on since
February 2016 that started in late 2015. The project aims to build a front-end
dashboard application allowing the user to interact with the company's
operational intelligence platform.

As the title of this article is suggesting, Angular in version 1.5 has been
chosen as the foundational framework although a beta version of Angular 2 was
available at the time the project was started. This has been done for two
reasons: Firstly, Angular 1.5 is stable and ready for production. Secondly,
Angular Material that has been selected for its easy integration of Material
Design into Angular is not yet compatible with the current version of Angular.

However, since the project is probably not going into production for the next
six months after it has been started, the decision could have been in favor of
Angular 2 if Angular Material would have been dropped. This would make the later
migration of the dashboard application to Angular 2 unnecessary.

## Developing with Migration in Mind

Nevertheless, Angular in version 1.5 has been chosen in conjunction with Angular
Material. Since it was clear that a migration to Angular 2 is inevitable in the
near future, code has been written with migration in mind.

### Avoid Scopes and Controllers

Replace controllers with component directives. Avoid `$scope` and use
`controllerAs` and `bindToController` instead. Scopes are obsolete in Angular 2
so it's a wise choice not using them whenever possible to make the task of
migration as easy as possible.

Instead of binding to `$scope` variables, properties of the controller are
directly bound to from the template HTML using the namespace defined by
`controllerAs`.

```
angular.module('myApp').directive('myName', function() {
  function controller() {
    var ctrl = this;

    this.firstName = "John";
    this.lastName = "Doe";
  }

  return {
    restrict: 'A',
    controller: controller,
    controllerAs: 'mnCtrl',
    template: '<span class="my-name">{{ mnCtrl.firstName }} ' +
              '{{ mnCtrl.lastName }}</span>'
  };
});
```

Notice that the controller inside the directive defined above is not a
traditional controller anymore since it is wrapped in a directive. It's
component logic. The properties assigned by the component logic can also be
replaced by an isolate scope defining those properties that are bound directly
to the directive controller a.k.a component logic using `bindToController`.

```
angular.module('myApp').directive('myName', function() {
  return {
    restrict: 'A',
    scope: {
      firstName: '=?',
      lastName: '=?'
    },
    controllerAs: 'mnCtrl',
    bindToController: true,
    template: '<span class="my-name">{{ mnCtrl.firstName }} ' +
              '{{ mnCtrl.lastName }}</span>'
  };
});
```

Notice that the directive defined above is still using the namespace defined by
`controllerAs`. All variables of the isolate scope are bound to the implicitly
defined directive controller.
