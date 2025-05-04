---
title: "Dice Algebra: A Formal System for Dice Distributions"
layout: post
show_excerpts: true
entries_layout: list
---

Dice Algebra is a concise, systematic way to describe and manipulate any ｢dice‑like｣ probability distribution over the integers.  Instead of only talking about ｢roll two six‑sided dice｣, you get a small toolkit of algebraic operations—addition, scaling, shifting, mixing, and more—that you can combine freely.

**Why use Dice Algebra?**

- **Clarity:** every operation has a precise definition and all the algebraic laws (associativity, commutativity, etc.) hold.
- **Composability:** you can build complex distributions—clamped dice, difference of dice, random‑count rolls—by stringing together a few primitives.
- **Uniformity:** ｢numbers｣ (like the integer 3) live in the same language as probability distributions (as a degenerate delta).

**Roadmap of this document:**

1. [The Underlying Set](#1-the-underlying-set)1.1
   1. [Delta Distributions](#11-deltadistributions)
2. [Core Operations](#2-core-operations)
   1. [Convolution (Sum of Independent Rolls)](#21-convolution-sum-of-independent-rolls)
   2. [$$n$$-Fold Convolution (Roll $$n$$ Times)](#22-n-fold-convolution-roll-n-times)
   3. [Scalar-Sum (Mix & Scale)](#23-scalarsum-mix--scale)
   4. [Outcome-Scaling](#24-outcomescaling)
   5. [Shift Operator](#25-shift-operator)
3. [Mixture Kernel](#3-the-mixture-kernel-mk)
   1. [Definition](#31-definition)
   2. [Example](#32-example)
   3. [How to Use $$M(k)$$](#33-how-to-use-mk)
4. [Embedding Integers](#4-embedding-integers-into-mathcald)
   1. [The Embedding Map](#41-the-embedding-map)
   2. [Recovering Integer Addition](#42-recovering-integer-addition)
   3. [Recovering Integer Multiplication](#43-recovering-integer-multiplication)
   4. [Shifts as Delta-Convolution](#44-shifts-as-deltaconvolution)
   5. [Why This Matters](#45-why-this-matters)
   6. [Note on integers vs. delta-distributions](#46-note-on-integers-vs-deltadistributions)
5. [Algebraic Laws](#5-algebraic-laws)
   1. [Identities](#51-identities)
   2. [Commutativity](#52-commutativity)
   3. [Associativity](#53-associativity)
   4. [Distributivity](#54-distributivity)
   5. [Scalar-Sum Collapse Law](#55-scalarsum-collapse-law)
   6. [Shift Semigroup](#56-shift-semigroup)
6. [Worked Examples](#6-worked-examples)
   1. [Basic Dice Tables](#61-basic-dice-tables)
      1. [One Six-Sided Die (1d6)](#611-one-sixsided-die-1d6)
      2. [Sum of Two d6’s (2d6)](#612-sum-of-two-d6s-2d6)
      3. [Scaling a d6 by 2 (2*1d6)](#613-scaling-a-d6-by-2-21d6)
   2. [Scalar-Sum Example: $$(1*1d4)\oplus(1*1d6)$$](#62-scalarsum-example-11d4oplus11d6)
   3. [Shift Example: $$S_1(1d4) \oplus 1d6$$](#63-shift-example-s_11d4-oplus-1d6)
7. [Extended Operations](#7-extended-operations)
   1. [Reflection / Negation](#71-reflection--negation)
   2. [Maximum / Minimum of Two Dice](#72-maximum--minimum-of-two-dice)
   3. [Convolution with Reflection (｢Difference｣)](#73-convolution-with-reflection-difference)
   4. [Composition of Dice](#74-composition-of-dice)
8. [Number–Delta Dictionary](#8-delta-distributions-and-scalar-embedding)
   1. [Delta Distributions](#81-delta-distributions)
   2. [Numbers as deltas](#82-numbers-as-deltas)
9. [Summary & Next Steps](#9-summary-and-structure-of-dice-algebra)
   1. [Core Structures](#91-core-structures)
   2. [Extended Operations](#92-extended-operations)

## 1. The Underlying Set

We work in the universe of **finite discrete probability distributions** over the integers:
$$
\mathcal{D} = \Bigl\{
    \,X:\mathbb{Z}\to[0,1]\;
    \Big|
    \;\sum_{k\in\mathbb{Z}}X(k)=1,
    \;X(k)=0\text{ for all but finitely many }k
    \Bigr\}.
$$

Each $$X\in\mathcal D$$ is called a *dice distribution*.

- **1d6**: uniform on $$\{1,2,3,4,5,6\}$$:

    $$
      1d6(k) =
      \begin{cases}
        \tfrac16, & k=1,2,3,4,5,6,\\
        0, & \text{otherwise.}
      \end{cases}
    $$

- **2d6**: the convolution $$1d6 + 1d6$$, giving the familiar 2–12 triangular shape.

### 1.1 Delta‑Distributions

For any integer $$n$$, define the **degenerate** or **delta** distribution at $$n$$:

$$
\delta_n(k) =
\begin{cases}
1, & k = n,\\
0, & \text{otherwise.}
\end{cases}
$$

- $$\delta_0$$ is the ｢zero｣ distribution (all mass at 0).
- $$\delta_n$$ lets us encode the *exact* outcome $$n$$.

**Light example table** for $$\delta_3$$:

| $$k$$ | $$\delta_3(k)$$ |
|:-----:|:---------------:|
|   0   |       0         |
|   1   |       0         |
|   2   |       0         |
|   3   |       1         |
|   4   |       0         |

## 2. Core Operations

In Dice Algebra, we have **five** fundamental ways to combine or transform distributions.  Each one is precise, yet builds the familiar ideas of ｢rolling,｣ ｢adding,｣ ｢scaling,｣ and more.

### 2.1 Convolution (Sum of Independent Rolls)

**Notation:**

$$
X + Y
$$

**Definition:**

$$
(X + Y)(k)
\;=\;
\sum_{i + j = k} X(i)\,Y(j).
$$

You roll $$X$$ and $$Y$$ independently and add the results.

**Example:** $$1d4 + 1d6$$ has support $$\{2,\dots,10\}$$. Probability of $$5$$:

$$
(1d4 + 1d6)(5)
=\sum_{i+j=5}1d4(i)\,1d6(j)
=\tfrac{1}{6}
$$

### 2.2 $$n$$-Fold Convolution (Roll $$n$$ Times)

**Notation:**

$$
n \cdot X
$$

**Definition:**

$$
n\cdot X = \underbrace{X + X + \cdots + X}_{n\text{ times}},
\quad
0\cdot X = \delta_0.
$$

You roll $$X$$ independently $$n$$ times and sum the results.

**Example:**

- $$3\cdot 1d4 = 1d4+1d4+1d4$$ has support $$\{3,\dots,12\}$$.
- It’s the familiar triangular distribution for $$3d4$$.

### 2.3 Scalar‑Sum (Mix & Scale)

**Notation:**

$$
(m*X)\;\oplus\;(n*Y)
$$

**Two‐step Definition:**

- **Weighted mixture**

   $$
   M(k) = \frac{m}{m+n}\,X(k)\;+\;\frac{n}{m+n}\,Y(k).
   $$

- **Scale outcomes**

   $$
   (m*X)\oplus(n*Y)
   = (m+n)\;*\;M.
   $$

Special case $$m=n=1$$:

$$
X\oplus Y = 2*\Bigl(\tfrac12X\oplus\tfrac12Y\Bigr).
$$

**Tip:** $$X=Y \Leftarrow (m*X)\oplus(n*X) = (m+n)*X$$.

This recovers ｢add two identical dice｣ as a pure scaling.

### 2.4 Outcome‑Scaling

**Notation:**

$$
n * X
$$

**Definition:**

$$
(n*X)(k) =
\begin{cases}
X\left( \frac{k}{n} \right), & \text{if } n \mid k, \\
0, & \text{otherwise.}
\end{cases}
$$

You multiply every outcome by $$n$$, keeping probabilities the same.

**Example:**

- $$2 * 1d6$$ has support $$\{2,4,6,8,10,12\}$$, each with probability $$\tfrac16$$.
- E.g.\ $$(2*1d6)(8)=1d6(4)=\tfrac{1}{6}$$.

### 2.5 Shift Operator

**Notation:**
$$
S_n X
$$

**Definition:**

$$
(S_n X)(k) = X(k - n).
$$

Equivalently $$S_n X = \delta_n + X$$ (convolution with $$\delta_n$$). Shifts every outcome up by $$n$$.

**Example:**

- $$S_{2}1d6$$ has support $$\{3,4,5,6,7,8\}$$, each $$\tfrac16$$.
- $$(S_2 1d6)(5) = 1d6(3) = \tfrac16$$.

## 3. The Mixture Kernel $$M(k)$$

Before we scale outcomes in the **Scalar‑Sum**, we first form a **pointwise mixture** of two distributions.  This is captured by the **Mixture Kernel** $$M$$.

### 3.1 Definition

For any $$X,Y\in\mathcal D$$ and weights $$m,n\in\mathbb{N}$$, set:

$$
p = \frac{m}{m+n},
$$

$$
q = \frac{n}{m+n},
$$

$$
p+q=1.
$$

Then define the **Mixture Kernel**:

$$
M(k) \;=\; p\,X(k)\;+\;q\,Y(k).
$$

- Intuitively, with probability $$p$$ you ｢draw｣ from $$X$$, and with probability $$q$$ from $$Y$$.
- Note $$\sum_k M(k)=1$$ because $$p+q=1$$ and each of $$X,Y$$ sums to 1.

### 3.2 Example

Let

$$
X = 1d4,\quad Y = 1d6,\quad m=1,\quad n=1.
$$

Then $$p=q=\tfrac12$$, and

$$
M(k) = \tfrac12\,1d4(k)\;+\;\tfrac12\,1d6(k).
$$

Since

$$
1d4(k)=
\begin{cases}
\tfrac14,&k=1,2,3,4,\\
0,&\text{otherwise,}
\end{cases}
$$

and

$$
1d6(k)=
\begin{cases}
\tfrac16,&k=1,2,3,4,5,6,\\
0,&\text{otherwise,}
\end{cases}
$$

we get the following table:

| $$k$$ | $$1d4(k)$$ | $$1d6(k)$$ | $$M(k)=\tfrac12[1d4(k)+1d6(k)]$$ |
|:-----:|:----------:|:----------:|:--------------------------------:|
|   1   | $$\tfrac14$$   | $$\tfrac16$$   | $$\tfrac12\!\bigl(\tfrac14+\tfrac16\bigr)=\tfrac5{24}$$ |
|   2   | $$\tfrac14$$   | $$\tfrac16$$   | $$\tfrac5{24}$$ |
|   3   | $$\tfrac14$$   | $$\tfrac16$$   | $$\tfrac5{24}$$ |
|   4   | $$\tfrac14$$   | $$\tfrac16$$   | $$\tfrac5{24}$$ |
|   5   |     0      | $$\tfrac16$$   | $$\tfrac12\!\bigl(0+\tfrac16\bigr)=\tfrac1{12}$$ |
|   6   |     0      | $$\tfrac16$$   | $$\tfrac1{12}$$ |

**Check normalization:**

$$\sum_{k=1}^6 M(k) = 4\cdot\tfrac5{24} + 2\cdot\tfrac1{12} = 1.$$

### 3.3 How to Use $$M(k)$$

Once you have $$M(k)$$, the **Scalar‑Sum** operation

$$
(m*X)\oplus(n*Y)
= (m+n) * M
$$

simply **scales** each outcome by $$(m+n)$$.  Concretely:

$$
\bigl((m*X)\oplus(n*Y)\bigr)(j) =
\begin{cases}
M\bigl(\tfrac{j}{m+n}\bigr), & (m+n)\mid j,\\
0, & \text{otherwise}.
\end{cases}
$$

In our example, $$(1*1d4)\oplus(1*1d6)=2*M$$ puts mass $$M(k)$$ at outcome $$2k$$. Where $$(m+n)\mid j$$ means $$j$$ is a multiple of $$m+n$$.

## 4. Embedding Integers into $$\mathcal{D}$$

A key feature of Dice Algebra is that **ordinary integers live inside** the same universe $$\mathcal D$$ as all dice distributions.  We do this via the **delta‑distributions** $$\delta_n$$.

### 4.1 The Embedding Map

Define

$$
\iota\colon \mathbb{Z}\;\longrightarrow\;\mathcal D,
\qquad
\iota(n) = \delta_n,
$$

where

$$
\delta_n(k) =
\begin{cases}
1, & k = n,\\
0, & \text{otherwise.}
\end{cases}
$$

Thus the integer $$n$$ is ｢the distribution that is always $$n$$.｣

### 4.2 Recovering Integer Addition

Under **convolution**, deltas add just like integers:

$$
\delta_m + \delta_n
\;=\;
\sum_{i+j = k} \delta_m(i)\,\delta_n(j)
\;=\;
\delta_{m+n}.
$$

- **Example:**

  $$
  2 + 3 = 5
  \quad\Longleftrightarrow\quad
  \delta_2 + \delta_3 = \delta_5.
  $$

### 4.3 Recovering Integer Multiplication

Under **outcome‑scaling**, deltas multiply:

$$
k * \delta_n
\;=\;
\delta_{k\,n}.
$$

- **Example:**

  $$
  3 \times 4 = 12
  \quad\Longleftrightarrow\quad
  3 * \delta_4 = \delta_{12}.
  $$

### 4.4 Shifts as Delta‑Convolution

Recall the **shift** operation

$$
S_n X = \delta_n + X.
$$

So convolving any $$X$$ with $$\delta_n$$ *shifts* it up by $$n$$:

- **Example:**
  Start with $$1d6$$:

  $$
  1d6(k) =
  \begin{cases}
    \tfrac16,&k=1,2,\dots,6,\\
    0,&\text{otherwise}.
  \end{cases}
  $$

  Then

  $$
  S_2(1d6) = \delta_2 + 1d6,
  $$

  which has support $$\{3,4,5,6,7,8\}$$ each with probability $$\tfrac16$$.

### 4.5 Why This Matters

- **Uniformity:** You don’t need a separate ｢number｣ system—integers are just a special case of dice.
- **Operators:** Deltas both *are* numbers and *act* as those numbers on any distribution (by convolution or scaling).
- **Simplicity:** All arithmetic properties (associativity, commutativity, distributivity) flow from the same underlying rules in $$\mathcal D$$.

### 4.6 Note on integers vs. delta‑distributions

Whenever you see a bare integer like `0`, `1`, or `2` in these laws, it stands for the corresponding **delta‑distribution** $$\delta_n$$.  For example:

$$1 * X = X \Rightarrow \delta_1* X = X$$

$$X + 0 = X \Rightarrow X + \delta_0 = X$$

$$2 \cdot X = X + X \Rightarrow \delta_2 \cdot X = X + X$$

This shorthand relies on the embedding $$n \mapsto \delta_n$$.

## 5. Algebraic Laws

Dice Algebra isn’t just a loose collection of operations—**every law** you know from elementary arithmetic (and more) holds here.  We state them in ⚙️ operational form, illustrating each with a tiny example using delta‑distributions $$\delta_n$$.

### 5.1 Identities

1. **Additive identity for convolution**

   $$
     X + \delta_{0} = X.
   $$

   *Example:*

   $$\;1d6 + \delta_{0} = 1d6.$$

2. **Multiplicative identity for scaling**

   $$
     \delta_{1} *X = X.
   $$

   *Example:*

   $$\;\delta_{1}* 1d4 = 1d4.$$

3. **Zero rolls**

   $$
     \delta_{0} \cdot X = \delta_{0},
     \quad
     \delta_{0} *X = \delta_{0}.
   $$

   *Example:*

   $$\;\delta_{0}\cdot1d6 = \delta_{0}$$;

   $$\;\delta_{0}*1d6 = \delta_{0}.$$

### 5.2 Commutativity

1. **Convolution**

   $$
     X + Y = Y + X.
   $$

   *Example:*

   $$\;\delta_{2} + \delta_{3} = \delta_{3} + \delta_{2} = \delta_{5}.$$

2. **Scalar‑Sum**

   $$
     (m*X)\oplus(n*Y) = (n*Y)\oplus(m*X).
   $$

   *Example:*

   $$(1*1d4)\oplus(2*1d6) = (2*1d6)\oplus(1*1d4).$$

### 5.3 Associativity

1. **Convolution**

   $$
     (X + Y) + Z = X + (Y + Z).
   $$

   *Example:*

   $$(\delta_{1}+\delta_{2})+\delta_{3} = \delta_{6} = \delta_{1}+(\delta_{2}+\delta_{3}).$$

2. **Scaling**

   $$
     m*(n*X) = (mn)*X.
   $$

   *Example:*

   $$2*(3*1d4) = 6*1d4.$$

3. **Scalar‑Sum**

   $$
     \bigl((m*X)\oplus(n*Y)\bigr)\oplus(p*Z)
     = (m*X)\oplus\bigl((n*Y)\oplus(p*Z)\bigr).
   $$

### 5.4 Distributivity

1. **Repeated‑roll over convolution**

   $$
     n\cdot (X + Y) = n\cdot X + n\cdot Y.
   $$

2. **Outcome‑scaling over convolution**

   $$
     n * (X + Y) = (n*X) + (n*Y).
   $$

   *Example:*

   Let $$X = \delta_{1}, Y = \delta_{2}, n=3$$.
   - LHS: $$3*(\delta_{1}+\delta_{2}) = 3*\delta_{3} = \delta_{9}.$$
   - RHS: $$(3*\delta_{1}) + (3*\delta_{2}) = \delta_{3} + \delta_{6} = \delta_{9}.$$

3. **Outcome‑scaling over scalar‑sum**

   $$
     n *\bigl((m*X)\oplus(p*Y)\bigr)
     = (n\!m)*X \;\oplus\; (n\!p)*Y.
   $$

### 5.5 Scalar‑Sum Collapse Law

Whenever you “scalar‑sum” **two copies of the same** distribution:

$$
  (m*X)\oplus(n*X) = (m+n)*X.
$$

*Example:*

$$(1*1d6)\oplus(2*1d6) = 3*1d6.$$

### 5.6 Shift Semigroup

Shifts compose like integers:

$$
  S_{m}\bigl(S_{n}X\bigr) = S_{m+n}X,
  \quad
  S_{0}X = X.
$$

*Example:*

$$
  S_{2}\bigl(S_{1}(1d4)\bigr) = S_{3}(1d4).
$$

## 6. Worked Examples

In this section we’ll see **three** concrete, step‑by‑step examples.  We’ll build small probability tables and check normalization at each stage.

### 6.1 Basic Dice Tables

#### 6.1.1 One Six‑Sided Die (1d6)

$$
1d6(k) =
\begin{cases}
\tfrac16, & k=1,2,3,4,5,6,\\
0,        & \text{otherwise.}
\end{cases}
$$

| Outcome $$k$$ | 1 | 2 | 3 | 4 | 5 | 6 |
|:-------------:|:-:|:-:|:-:|:-:|:-:|:-:|
| Probability   |1/6|1/6|1/6|1/6|1/6|1/6|

#### 6.1.2 Sum of Two d6’s (2d6)

$$
2d6 = 1d6 + 1d6,\quad (1d6+1d6)(k) = \sum_{i+j=k}1d6(i)\,1d6(j).
$$

| Sum $$k$$ | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 |
|:---------:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Probability |1/36|2/36|3/36|4/36|5/36|6/36|5/36|4/36|3/36|2/36|1/36|

#### 6.1.3 Scaling a d6 by 2 (2*1d6)

$$
(2*1d6)(k) =
\begin{cases}
1d6(k/2), & 2\mid k,\\
0,        & \text{otherwise.}
\end{cases}
$$

| Outcome $$k$$ | 2  | 4  | 6  | 8  | 10 | 12 |
|:-------------:|:--:|:--:|:--:|:--:|:--:|:--:|
| Probability   |1/6 |1/6 |1/6 |1/6 |1/6 |1/6 |

### 6.2 Scalar‑Sum Example: $$(1\!*\!1d4)\oplus(1\!*\!1d6)$$

We compute

$$
(1*1d4)\oplus(1*1d6) = 2*(\frac{1}{2}*1d4)\oplus(\frac{1}{2}*1d6) = 2 * M,
$$

$$
M(k)=\tfrac12\,1d4(k)+\tfrac12\,1d6(k).
$$

#### Step 1: Build $$M(k)$$

| $$k$$ | 1d4(k) | 1d6(k) | $$M(k)=\tfrac12[1d4(k)+1d6(k)]$$ |
|:-----:|:------:|:------:|:--------------------------------:|
|   1   | 1/4    | 1/6    | $$\tfrac5{24}$$                  |
|   2   | 1/4    | 1/6    | $$\tfrac5{24}$$                  |
|   3   | 1/4    | 1/6    | $$\tfrac5{24}$$                  |
|   4   | 1/4    | 1/6    | $$\tfrac5{24}$$                  |
|   5   | 0      | 1/6    | $$\tfrac1{12}$$                  |
|   6   | 0      | 1/6    | $$\tfrac1{12}$$                  |

Check:

$$\;4\times\tfrac5{24}+2\times\tfrac1{12}=1.$$

#### Step 2: Scale by 2

$$
(2*M)(j) =
\begin{cases}
M(j/2), & 2\mid j,\\
0, & \text{otherwise.}
\end{cases}
$$

| $$j$$ | 2    | 4    | 6    | 8    | 10   | 12   |
|:-----:|:----:|:----:|:----:|:----:|:----:|:----:|
| $$(2*M)(j)$$ |5/24 |5/24 |5/24 |5/24 |1/12 |1/12 |

### 6.3 Shift Example: $$S_1(1d4) \oplus 1d6$$

We are applying the **Scalar‑Sum** operation to a $$ S_1(1d4) $$, which supports $$\{2,3,4,5\}$$ with probabilities $$\tfrac14$$ each with $$1d6$$, which supports $$\{1,2,3,4,5,6\}$$ with probabilities $$\tfrac16$$ each.

#### 6.3.1 Step 1: Build $$S_1(1d4)$$ and $$1d6$$

$$
S_1(1d4)(k) = 1d4(k - 1) =
\left\{
\begin{array}{ll}
\frac{1}{4}, & k \in \{2, 3, 4, 5\} \\
0, & \text{otherwise}
\end{array}
\right.
$$

$$
1d6(k) =
\left\{
\begin{array}{ll}
\frac{1}{6}, & k \in \{1, 2, 3, 4, 5, 6\} \\
0, & \text{otherwise}
\end{array}
\right.
$$

#### 6.3.2 Step 2: Build $$M(k)$$

$$
(S_1(1d4) \oplus 1d6)(k) = 2*M(k) = 2*(\frac{1}{2} \cdot S_1(1d4)(k) + \frac{1}{2} \cdot 1d6(k))
$$

| $$k$$ | 1d6(k) | 1d4(k) | $$M(k)$$            |
|:-----:|:------:|:------:|:--------------------:|
|   1   | 1/6    | 0      | $$\tfrac{1}{12}$$      |
|   2   | 1/6    | 1/4    | $$\tfrac{5}{24}$$      |
|   3   | 1/6    | 1/4    | $$\tfrac{5}{24}$$      |
|   4   | 1/6    | 1/4    | $$\tfrac{5}{24}$$      |
|   5   | 1/6    | 1/4    | $$\tfrac{5}{24}$$      |
|   6   | 1/6    | 0      | $$\tfrac{1}{12}$$      |

#### 6.3.3 Step 3: Scale by 2

$$
(2*M)(j) =
\begin{cases}
M(j/2), & 2\mid j,\\
0, & \text{otherwise.}
\end{cases}
$$

| $$j$$ | 2    | 4    | 6    | 8    | 10   | 12   |
|:-----:|:----:|:----:|:----:|:----:|:----:|:----:|
| $$(2*M)(j)$$ |1/12 |5/24 |5/24 |5/24 |5/24 |1/12 |

## 7. Extended Operations

Beyond the core five, Dice Algebra includes powerful extras.  We’ll define each and work a small example.

### 7.1 Reflection / Negation

**Definition:**

$$
-(X)(k) \;=\; X(-k).
$$

｢Mirror｣ the pmf about zero.

**Example:** Reflecting a 1d6 gives outcomes $$-1,\dots,-6$$.

| $$k$$  | –6   | –5   | –4   | –3   | –2   | –1   |
|:------:|:----:|:----:|:----:|:----:|:----:|:----:|
| $$-(1d6)(k)$$ |1/6|1/6|1/6|1/6|1/6|1/6|

### 7.2 Maximum / Minimum of Two Dice

**Definitions:**

$$
(X\vee Y)(k) \;=\; \sum_{\max(i,j)=k} X(i)\,Y(j),
$$

$$
(X\wedge Y)(k) \;=\; \sum_{\min(i,j)=k} X(i)\,Y(j).
$$

｢Roll two dice; pick the larger (or smaller).｣

**Example:** $$X=1d4,\;Y=1d6$$.  We compute $$P(\max=k)$$ via

$$
P(\max \le k) = P(X\le k)\,P(Y\le k),
\quad
P(\max = k) = P(\max\le k) - P(\max\le k-1).
$$

| $$k$$ | 1      | 2      | 3      | 4      | 5      | 6      |
|:-----:|:------:|:------:|:------:|:------:|:------:|:------:|
| $$P(X\le k)$$ |1/4|2/4|3/4|1|1|1|
| $$P(Y\le k)$$ |1/6|2/6|3/6|4/6|5/6|1|
| $$P(\max\le k)$$ |1/24|1/6|3/8|4/6|5/6|1|
| $$P(\max= k)$$ |1/24|1/6−1/24=3/24|3/8−1/6=1/24|4/6−3/8=7/24|5/6−4/6=1/6|1−5/6=1/6|

So

$$
X\vee Y = \{1:1/24,\;2:3/24,\;3:1/24,\;4:7/24,\;5:1/6,\;6:1/6\}.
$$

### 7.3 Convolution with Reflection (｢Difference｣)

**Definition:**

$$
X - Y \;=\; X * -(Y),
\quad (X-Y)(k)=\sum_{i-j=k}X(i)\,Y(j).
$$

**Example:** $$1d6 - 1d6$$ has support $$\{-5,\dots,5\}$$, with

$$
P(k) = \frac{6 - |k|}{36}.
$$

| $$k$$ | –5 | –4 | –3 | –2 | –1 | 0  | 1  | 2  | 3  | 4  | 5  |
|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| $$P$$ |1/36|2/36|3/36|4/36|5/36|6/36|5/36|4/36|3/36|2/36|1/36|

### 7.4 Composition of Dice

**Definition:**

$$
(X\circ Y)(k)
=\sum_{i\in\mathbb Z}X(i)\;\bigl(i\text{-fold roll sum of }Y\bigr)(k).
$$

You first roll $$X$$ to get $$i$$, then roll $$Y$$ a total of $$i$$ times and sum.

**Example:** Let $$X=1d2$$ (a coin: outcomes 1 or 2 with $$\tfrac12$$) and $$Y=1d4$$.

1. If $$i=1$$ (prob.\ $$\tfrac12$$), you roll one d4 → distribution $$1d4$$.
2. If $$i=2$$ (prob.\ $$\tfrac12$$), you roll two d4’s → distribution $$2d4$$.

| outcome $$k$$ | 1    | 2       | 3       | 4       | 5       | 6       | 7       | 8       |
|:-------------:|:----:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| $$1d4(k)$$    |1/4  |1/4     |1/4     |1/4     |0       |0       |0       |0       |
| $$2d4(k)$$    |0    |1/16    |2/16    |3/16    |4/16    |3/16    |2/16    |1/16    |
| $$(X\circ Y)(k)$$ |½·1/4=1/8 |½(1/4+1/16)=5/32 |½(1/4+2/16)=3/16 |½(1/4+3/16)=7/32 |½·4/16=1/8 |½·3/16=3/32 |½·2/16=1/16 |½·1/16=1/32 |

## 8. Delta Distributions and Scalar Embedding

### 8.1 Delta Distributions

**Delta Distributions** are probability distributions where **all** the probability mass is concentrated at a single outcome.

We define the **delta** (or **degenerate**) distribution at $$n \in \mathbb{Z} $$ as:

$$
\delta_n(k) =
\begin{cases}
1 & \text{if } k = n \\
0 & \text{otherwise}
\end{cases}
$$

This is also denoted as:

$$
\delta_n = \text{"always returns } n\text{"}.
$$

**Examples:**

- $$\delta_0$$ is the identity element for convolution:

  $$
  \delta_0 * X = X.
  $$

- $$\delta_1$$ is the multiplicative identity for scalar sum:

  $$
  \delta_1 \oplus X = X.
  $$

### 8.2 Numbers as Deltas

Every integer $$ n \in \mathbb{Z} $$ can be interpreted as the delta distribution $$ \delta_n $$. This provides a **bridge** between deterministic and probabilistic values.

- Any number $$ n $$ is isomorphic to $$ \delta_n $$.
- This allows us to embed $$ \mathbb{Z} \subset \mathcal{D} $$ (the space of all discrete distributions).

**Why is this useful?**

This lets us:

- Treat numbers like dice distributions,
- Use them in convolution, scalar sums, and shifts,
- Define arithmetic in fully probabilistic terms.

## 9. Summary and Structure of Dice Algebra

### 9.1 Core Structures

| Operation       | Symbol         | Description                           |
|-----------------|----------------|---------------------------------------|
| Sum             | $$ + $$        | Convolution (sum of independent dice) |
| $$n$$-Sum       | $$ \cdot $$    | Repeated convolution $$n$$ times      |
| Scalar-Sum      | $$ \oplus $$   | Mixture / repeated structure          |
| Outcome‑Scaling | $$ * $$        | Scale outcomes by $$n$$               |
| Shift           | $$ S_n $$      | Additive shift of distribution        |
| Delta           | $$ \delta_n $$ | Deterministic values as dice          |

### 9.2 Extended Operations

| Operation          | Symbol         | Description                              |
|-------------------|----------------|------------------------------------------|
| Reflection        | $$ -(X) $$ | Mirror values: $$ X(-k) $$             |
| Max / Min         | $$ X \vee Y, X \wedge Y $$ | Max/min of two dice         |
| Signed Convolution| $$ X - Y $$     | Difference of rolls                      |
| Composition       | $$ X \circ Y $$ | "Roll a roll" – hierarchical dice        |
