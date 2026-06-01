---
layout: default
title: O que são polimorfismo e hereditariedade? Similaridades, diferenças e exemplos em Python, Golang, Rust e JavaScript
title_en: What are polymorphism and inheritance? Similarities, differences, and examples in Python, Go, Rust, and JavaScript
---

<div class="lang-en" markdown="1">

# Questions & Answers

## What are polymorphism and inheritance?

**Inheritance** is a relationship where one type is built on top of another and reuses part of its structure or behavior. In classic object-oriented design, this is usually described as an *is-a* relationship. For example, a `Dog` can inherit from `Animal`.

**Polymorphism** means “many forms.” In programming, it is the ability to use different types through the same interface and get different behavior depending on the concrete type. A single call such as `speak()` can behave differently depending on which object receives it.

## How they relate

- Both help organize code around abstraction instead of repeating logic everywhere.
- Both can improve readability when used carefully.
- Inheritance can be one way to achieve polymorphism, but polymorphism does not require inheritance.

## Differences

- Inheritance shares structure and behavior through a parent-child relationship.
- Polymorphism is about calling the same operation on different types and getting type-specific behavior.
- Inheritance can create tighter coupling; polymorphism usually focuses on interfaces and contracts.
- Polymorphism can exist without inheritance.

## Comparative examples

### Python

Python supports class inheritance and method overriding very naturally.

```python
class Animal:
    def speak(self):
        return "..."


class Dog(Animal):
    def speak(self):
        return "woof"


def make_it_speak(animal):
    print(animal.speak())


make_it_speak(Dog())
```

### Go

Go does not use class inheritance. It favors interfaces, which are a common way to express polymorphism.

```go
package main

type Speaker interface {
    Speak() string
}

type Dog struct{}

func (Dog) Speak() string {
    return "woof"
}
```

### Rust

Rust also avoids class inheritance. Traits are the standard way to share behavior and enable polymorphism.

```rust
trait Speaker {
    fn speak(&self) -> &'static str;
}

struct Dog;

impl Speaker for Dog {
    fn speak(&self) -> &'static str {
        "woof"
    }
}
```

### JavaScript

JavaScript supports inheritance with `extends`, but its runtime model is still prototype-based.

```javascript
class Animal {
  speak() {
    return '...';
  }
}

class Dog extends Animal {
  speak() {
    return 'woof';
  }
}

function makeItSpeak(animal) {
  console.log(animal.speak());
}

makeItSpeak(new Dog());
```

In short: inheritance is a reuse mechanism, while polymorphism is a behavior mechanism. A language may support both, one, or neither in the classical object-oriented sense.

## When to use each one

- Use inheritance when there is a real *is-a* relationship and a shared base implementation genuinely reduces duplication.
- Use polymorphism when you want one piece of code to work with multiple interchangeable types.
- Prefer polymorphism when you want looser coupling, easier testing, and simpler extensions over time.
- Avoid inheritance just to reuse a few methods if the hierarchy does not make conceptual sense.

## Practical rule of thumb

If you need to share a base implementation and a strong hierarchy makes sense, inheritance can be useful. If you mainly want interchangeable behavior, polymorphism through interfaces, traits, or duck typing is often the better tool.

## Summary

Inheritance is a way to reuse code through type hierarchy. Polymorphism is a way to write code that works with many concrete types through the same interface. In modern code, polymorphism is usually the more flexible and safer abstraction, while inheritance is best kept for cases where the hierarchy is truly natural.

</div>

<div class="lang-pt" markdown="1">

# Perguntas & Respostas

## O que são polimorfismo e hereditariedade?

**Hereditariedade** é a relacao em que um tipo reaproveita estrutura e comportamento de outro tipo. No design orientado a objetos clássico, isso normalmente é descrito como uma relação de *é-um*. Por exemplo, um `Cachorro` pode herdar de `Animal`.

**Polimorfismo** significa “muitas formas”. Em programação, é a capacidade de usar tipos diferentes por meio da mesma interface e obter comportamentos diferentes dependendo do tipo concreto. Uma chamada como `falar()` pode se comportar de forma diferente dependendo de quem recebe a mensagem.

## Como se relacionam

- Os dois ajudam a organizar o código com abstração em vez de repetir logica em todo lugar;
- Os dois podem melhorar a legibilidade quando usados com critério;
- A hereditariedade pode ser uma forma de obter polimorfismo, mas polimorfismo não depende de hereditariedade.

## Diferenças

- Hereditariedade compartilha estrutura e comportamento por meio de uma relação pai-filho;
- Polimorfismo trata de chamar a mesma operação em tipos diferentes e obter comportamento especifico de cada tipo;
- Hereditariedade pode gerar mais acoplamento; polimorfismo costuma focar em interfaces e contratos;
- Polimorfismo pode existir sem hereditariedade.

## Exemplos comparativos

### Python

Python suporta hereditariedade por classes e override de metodo de forma natural.

```python
class Animal:
    def falar(self):
        return "..."


class Cachorro(Animal):
    def falar(self):
        return "au au"


def fazer_falar(animal):
    print(animal.falar())


fazer_falar(Cachorro())
```

### Golang

Go não usa hereditariedade de classes. Ele favorece interfaces, que são uma forma muito comum de polimorfismo.

```go
package main

type Falante interface {
    Falar() string
}

type Cachorro struct{}

func (Cachorro) Falar() string {
    return "au au"
}
```

### Rust

Rust também evita hereditariedade de classes. Traits são a forma padrao de compartilhar comportamento e obter polimorfismo.

```rust
trait Falante {
    fn falar(&self) -> &'static str;
}

struct Cachorro;

impl Falante for Cachorro {
    fn falar(&self) -> &'static str {
        "au au"
    }
}
```

### JavaScript

JavaScript suporta herança com `extends`, mas o modelo de execução continua sendo baseado em protótipos.

```javascript
class Animal {
  falar() {
    return '...';
  }
}

class Cachorro extends Animal {
  falar() {
    return 'au au';
  }
}

function fazerFalar(animal) {
  console.log(animal.falar());
}

fazerFalar(new Cachorro());
```

Resumindo: hereditariedade é um mecanismo de reaproveitamento; polimorfismo é um mecanismo de comportamento. Uma linguagem pode suportar os dois, apenas um deles, ou nenhum no sentido classico de orientacao a objetos.

## Quando usar cada um

- Use hereditariedade quando existir uma relação real de *é-um* e a implementação base realmente reduzir duplicação.
- Use polimorfismo quando voce quer que o mesmo codigo funcione com varios tipos intercambiaveis.
- Prefira polimorfismo quando voce quer menos acoplamento, testes mais simples e extensao mais facil ao longo do tempo.
- Evite hereditariedade so para reaproveitar alguns metodos se a hierarquia nao fizer sentido conceitual.

## Regra pratica

Se voce precisa compartilhar uma implementacao base e uma hierarquia faz sentido, hereditariedade pode ser util. Se a ideia principal e trocar comportamentos de forma flexivel, polimorfismo por interfaces, traits ou duck typing costuma ser a melhor escolha.

## Resumo

Hereditariedade e uma forma de reaproveitar codigo por meio de hierarquia de tipos. Polimorfismo e uma forma de escrever codigo que funciona com varios tipos concretos por meio da mesma interface. Em codigo moderno, o polimorfismo costuma ser a abstracao mais flexivel e segura, enquanto a hereditariedade deve ser reservada para casos em que a hierarquia realmente faz sentido.

</div>
