---
layout: post
comments: true
title: "Back to Basics #4 - Desmistificando Jargões: Python"
date: 2020-06-28
---

First, Some Conventions

Python is what is known as a statement-oriented language; but what is a statement? Well, for the purposes of this article we’re just going to say that in Python a statement is a single line of code that does something. What it does, specifically, depends on the building blocks of that statement.

But what are those building blocks? Well, let’s define them quickly and very roughly, since we’ll go into more detail about them in later posts. I’ll use UPPERCASE letters to make it easier to visually distinguish these abstract forms from the specific instances we’ll talk about later.

KEYWORD
A reserved word the meaning of which cannot be changed by the user. We will visit all 35 of these in the next section of this article.
OPERATOR
A reserved symbol that indicates an action to be performed. For example, = is the assignment OPERATOR and + is the addition OPERATOR. There are quite a few others, but we’ll save them for the next post. A small number of KEYWORDs behave like OPERATORs, and I’ll point those out below.

These are both provided by Python and you can’t directly change their meaning, which means that they’re somewhat inflexible. To do most work you’ll need something more flexible, which is why Python gives you the ability to represent anything.

OBJECT
An individual thing you can interact with. Unlike KEYWORDs and OPERATORs, you can directly manipulate these, though the degree to which you can manipulate them depends on what type of OBJECT they are. You can also use KEYWORDs to define entirely new types, which makes them a very expressive way of building new things of your own. So expressive, in fact, that practically speaking everything you interact with in Python will be an OBJECT.

That can be a bit abstract and hard to wrap your head around at this point, though. For now just know that OBJECTs tend to fall into three main categories.

VALUE
An OBJECT that represents a single, concrete thing; for the purposes of this discussion what that thing actually is is irrelevant, but as an example, 4 is a VALUE of the int (short for integer) type and hello is a VALUE of the str (short for string) type. These are both examples of primitive types, which have a single meaningful value, but there are also composite types for describing things the meaning of which is defined by more than one attribute. A real-world example would be a rectangle, which cannot be defined without both height and width. As you’ll see below three special KEYWORDs all behave like VALUEs, though as before you cannot change their meaning.
COLLECTION
An OBJECT that groups together or contains other OBJECTs; there are many different types of COLLECTIONs in Python, but for the moment all we care about is that a COLLECTION contains zero or more OBJECTs. For example the statement [2, 3, 4] creates a COLLECTION of the type list that holds three VALUEs inside of it. A COLLECTION can contain any OBJECT, so you can nest a COLLECTION inside another COLLECTION.
CALLABLE
An OBJECT that represents some action to perform: it performs that action when you call it with some number of arguments then it returns (or gives back) an OBJECT. For instance sum is a CALLABLE and when we call it using sum([2, 3, 4]) it gives us back the VALUE 9. There are several different kinds of CALLABLE, and we’ll touch on them in more detail below.

It wouldn’t be very efficient to type out the same OBJECT every time you needed to refer to it, though. It’s often very helpful to be able to refer to things indirectly.

NAME
Any word that is not a KEYWORD, and that is used as an alias to refer to some specific OBJECT. Unlike a KEYWORD the meaning of a NAME may change over the course of a program, which is why these are often – if a little incorrectly – thought of as variables. There are several ways to create new NAMEs (and one to destroy them), as we’ll see below, but as a simple example in number = 2 the assignment OPERATOR = creates the NAME number and assigns it to refer to the VALUE 2. When later that is followed by number += 2, however, the augmented assignment OPERATOR += will re-assign number to refer to 4.

Now we’ve got all the simple building blocks defined and we can start organizing them into composite structures.

EXPRESSION
Any composite form of one or more of the above that can be evaluated to an OBJECT. For example, 4, 2 + 2, 1 \* 3 + 1 and sum([1, 1, 1, 1]) are all EXPRESSIONs that evaluate to 4. The EXPRESSION represents the smallest discrete unit of work in Python.
STATEMENT
Any single line of code that is composed of at least one of the above. These can get quite complex, but to do anything they’ll usually need to include KEYWORDs and/or OPERATORs plus EXPRESSIONs. You’ve already met a useful STATEMENT in number = 2. If you read each STATEMENT in a program out in turn you can track the program as it does its work.

That covers any given line of code, but there are also a couple of higher level structures we need to define for the moment:

BLOCK
At least two STATEMENTs that are bound together; the first STATEMENT will end in a : character and indicates the start of the BLOCK. The second and all further STATEMENTs inside that BLOCK will be indented further right than the initial STATEMENT, to indicate that they belong to the same BLOCK. The last such indented STATEMENT represents the end of the BLOCK.
MODULE
A single Python .py file; it’s composed of some number of STATEMENTS. All Python programs are comprised of at least one MODULE. As you’ll see below we write all of our functionality inside MODULEs, and we use KEYWORDs and NAMEs to import functionality from other MODULEs.

There are many other concepts you’ll need to become familiar with, but with these building blocks we can investigate all 35 words in Python’s relatively small vocabulary, and thus understand the skeleton of any Python program.

**E aí? Gostou do artigo? Acha que faltou abordar alguma questão?**

**Comenta aqui e me deixa saber se esse conteúdo te ajudou de alguma forma.**

_**Até a próxima!**_
