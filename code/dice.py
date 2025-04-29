from collections import Counter, defaultdict
from fractions import Fraction
from itertools import product
from typing import NamedTuple, Self

import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
import seaborn as sns
import time


class ValueProbability(NamedTuple):
    """
    A named tuple to represent a value and its associated probability.
    """

    value: int
    probability: Fraction

    def __str__(self):
        return f"Value: {self.value}, Probability: {self.probability:.2%}"

    def __repr__(self):
        return f"ValueProbability(value={self.value}, probability={self.probability})"


class Die:
    def __init__(self, sides: int = 6, offset: int = 0, weight: int = 1):
        if sides < 1 or not isinstance(sides, int):
            raise ValueError("Number of sides must be a positive integer.")

        self._sides = sides
        self._offset = offset
        self._weight = weight

    @property
    def sides(self):
        return self._sides

    @property
    def offset(self):
        return self._offset

    @property
    def weight(self):
        return self._weight

    def __str__(self):
        weight = f"{self.weight} * (" if abs(self.weight) != 1 else ""
        weight = f"-" if self.weight == -1 else weight
        close_bracket = ")" if abs(self.weight) != 1 else ""

        offset = f" + {self.offset}" if self.offset else ""

        return f"{weight}1d{self.sides}{close_bracket}{offset}".strip().replace(
            "  ", " "
        )

    def __add__(self, other: Self | int):
        if isinstance(other, int):
            return Die(self.sides, self.offset + other, self.weight)

        if isinstance(other, type(self)):
            return Dice(self, other)

        raise TypeError(
            "Unsupported operand type(s) for +: 'Die' and '{}'".format(
                type(other).__name__
            )
        )

    def __radd__(self, other: int):
        return self.__add__(other)

    def __sub__(self, other: Self | int):
        return self.__add__(-other)

    def __rsub__(self, other: int):
        return self.__sub__(other)

    def __mul__(self, weight: int):
        if weight == 0:
            return 0

        if isinstance(weight, int):
            return Die(self.sides, self.offset * weight, self.weight * weight)

        raise TypeError(
            "Unsupported operand type(s) for *: 'Die' and '{}'".format(
                type(weight).__name__
            )
        )

    def __rmul__(self, weight: int):
        return self.__mul__(weight)

    def __matmul__(self, other: int):
        if isinstance(other, int) and other >= 0:
            dice = tuple(
                Die(self.sides, self.offset, self.weight) for _ in range(other)
            )
            return Dice(*dice)

        if isinstance(other, int) and other < 0:
            dice = tuple(
                Die(self.sides, -self.offset, -self.weight) for _ in range(-other)
            )
            return Dice(*dice)

        raise TypeError(
            "Unsupported operand type(s) for *: 'Die' and '{}'".format(
                type(other).__name__
            )
        )

    def __rmatmul__(self, other: int):
        return self.__matmul__(other)

    def __neg__(self):
        return Die(self.sides, -self.offset, -self.weight)

    def min_range(self):
        """
        Returns the minimum value of the die.
        """
        start = 1
        if self.weight < 0:
            start = self.sides

        return start * self.weight + self.offset

    def max_range(self):
        """
        Returns the maximum value of the die.
        """
        end = 1
        if self.weight > 0:
            end = self.sides

        return end * self.weight + self.offset

    def range(self):
        """
        Returns an iterator over the sides of the die.
        """
        start = self.min_range()
        end = self.max_range()

        return iter(range(start, end + 1, abs(self.weight)))

    def distribution(self):
        """
        Returns a list of the possible outcomes of rolling the die.
        """
        return [ValueProbability(i, Fraction(1, self.sides)) for i in self.range()]

    def cumulative_distribution(self):
        """
        Returns a list of the cumulative probabilities of rolling the die, use the distribution
        """
        dist = self.distribution()
        return [
            ValueProbability(
                i,
                sum(vp.probability for vp in dist if vp.value <= i),
            )
            for i in self.range()
        ]

    def inverse_cumulative_distribution(self):
        """
        Returns a list of the inverse cumulative probabilities of rolling the die.
        """
        dist = self.distribution()
        return [
            ValueProbability(
                i,
                sum(vp.probability for vp in dist if vp.value >= i),
            )
            for i in self.range()
        ]

    def simplify(self):
        return Dice(Die(self.sides, 0, self.weight), offset=self.offset)


class Dice:
    def __init__(self, *dice: Die, offset: int = 0):
        self._dice: tuple[Die, ...] = dice
        self._offset: int = offset

    @property
    def offset(self):
        return self._offset

    @property
    def dice(self):
        return self._dice

    def __add__(self, other: Self | Die | int):
        if not isinstance(other, (type(self), Die, int)):
            raise TypeError(
                "Unsupported operand type(s) for +: 'Dice' and '{}'".format(
                    type(other).__name__
                )
            )

        if isinstance(other, int):
            offset = self.offset + other
            dice = self.dice

        if isinstance(other, type(self)):
            offset = self.offset + other.offset
            dice = self.dice + other.dice

        if isinstance(other, Die):
            offset = self.offset
            dice = other, *self.dice

        return type(self)(*dice, offset=offset)

    def __radd__(self, other: Die | int):
        return self.__add__(other)

    def __sub__(self, other: Self | Die | int):
        return self.__add__(-other)

    def __rsub__(self, other: Die | int):
        return self.__sub__(other)

    def __matmul__(self, other: int):
        if isinstance(other, int) and other >= 0:
            dice = tuple(
                Die(die.sides, die.offset, die.weight) for die in self.dice * other
            )
            offset = self.offset * other
            return type(self)(*dice, offset=offset)

        if isinstance(other, int) and other < 0:
            dice = tuple(
                Die(die.sides, -die.offset, -die.weight)
                for die in self.dice * abs(other)
            )
            offset = self.offset * other
            return type(self)(*dice, offset=offset)

        raise TypeError(
            "Unsupported operand type(s) for *: 'Dice' and '{}'".format(
                type(other).__name__
            )
        )

    def __rmatmul__(self, other: int):
        return self.__matmul__(other)

    def __mul__(self, weight: int):
        if weight == 0:
            return 0

        if isinstance(weight, int):
            dice = tuple(die * weight for die in self.dice)
            offset = self.offset * weight
            return type(self)(*dice, offset=offset)

        raise TypeError(
            "Unsupported operand type(s) for *: 'Dice' and '{}'".format(
                type(weight).__name__
            )
        )

    def __rmul__(self, weight: int):
        return self.__mul__(weight)

    def __neg__(self):
        return self.__mul__(-1)

    def __str__(self):
        sign = "+" if self.offset >= 0 else "-"
        offset = f"{sign} {abs(self.offset)}" if self.offset else ""

        dice = [str(die) for die in self.dice]
        dice_distinct = Counter(dice)

        dice = [
            f"{die}".replace("1d", f"{count}d") for die, count in dice_distinct.items()
        ]
        dice = " + ".join(dice)
        dice = f"{dice} {offset}".strip().replace("  ", " ")
        dice = dice.replace(" + -", " -").replace(" - +", " -")
        dice = dice.replace(" - -", " +").replace(" + +", " +")

        return dice

    def range(self):
        """
        Returns an iterator over the possible outcomes of rolling the combined dice.
        """
        start_value = sum(die.min_range() for die in self.dice) + self.offset
        end_value = sum(die.max_range() for die in self.dice) + self.offset
        return iter(range(start_value, end_value + 1))

    def distribution_brute_force(self):
        """
        Returns the distribution of the combined dice.
        """
        start_time = time.time()
        combined_distribution: list[ValueProbability] = []

        dists = [die.distribution() for die in self.dice]
        print(f"Time to create distributions: {time.time() - start_time:.2f} seconds")

        i = 0
        for dice in product(*dists):
            # Calculate the sum of the values and the product of the probabilities
            value = sum(vp.value for vp in dice)
            probability = 1
            for vp in dice:
                probability *= vp.probability

            vp = ValueProbability(value, probability)
            combined_distribution.append(vp)
            i += 1

        print(i)

        print(
            f"Time to create combined distribution: {time.time() - start_time:.2f} seconds"
        )

        # Combine the distributions
        combined_distribution_dict: defaultdict[int, Fraction] = defaultdict(
            lambda: Fraction(0)
        )

        for vp in combined_distribution:
            combined_distribution_dict[vp.value] += vp.probability

        combined_distribution = [
            ValueProbability(value + self.offset, probability)
            for value, probability in combined_distribution_dict.items()
        ]

        print(f"Time to combine distributions: {time.time() - start_time:.2f} seconds")

        return sorted(combined_distribution, key=lambda vp: vp.value)

    def distribution(self):

        def conv(a: list[ValueProbability], b: list[ValueProbability]):
            c = defaultdict(lambda: Fraction(0))
            for va, pa in a:
                for vb, pb in b:
                    c[va + vb] += pa * pb
            return [ValueProbability(v, p) for v, p in c.items()]

        dist = [ValueProbability(0, Fraction(1))]

        for die in self.dice:
            base = die.distribution()
            dist = conv(dist, base)

        return [
            ValueProbability(value + self.offset, probability)
            for value, probability in dist
        ]

    def cumulative_distribution(self):
        """
        Returns the cumulative distribution of the combined dice, use the distribution
        """
        dist = self.distribution()
        return [
            ValueProbability(
                i,
                sum(vp.probability for vp in dist if vp.value <= i),
            )
            for i in self.range()
        ]

    def inverse_cumulative_distribution(self):
        """
        Returns the inverse cumulative distribution of the combined dice.
        """
        dist = self.distribution()
        return [
            ValueProbability(
                i,
                sum(vp.probability for vp in dist if vp.value >= i),
            )
            for i in self.range()
        ]

    def simplify(self):
        """
        Simplifies the dice expression by combining the offset
        """
        offset_sum = sum(die.offset for die in self.dice) + self.offset
        dice = tuple(Die(die.sides, 0, die.weight) for die in self.dice)

        return type(self)(*dice, offset=offset_sum)


def plot_distributions(dice: list[Dice | Die], cumulative: bool = False):
    sns.set_theme(style="whitegrid")

    plt.figure(figsize=(8, 4))

    for die in dice:

        die = die.simplify()
        dist = die.distribution()

        mean = sum(vp.value * vp.probability for vp in dist) / sum(
            vp.probability for vp in dist
        )
        std = sum((vp.value - mean) ** 2 * vp.probability for vp in dist) ** 0.5

        if cumulative:
            dist = die.cumulative_distribution()

        values = [vp.value for vp in dist]
        probability = [float(vp.probability) for vp in dist]

        die_label = str(die).replace(" ", "") + f" μ={mean:.2f} σ={std:.2f}"
        sns.lineplot(x=values, y=probability, label=die_label, markers=True, marker="o")

    if cumulative:
        plt.title("Cumulative Distribution")
    else:
        plt.title("Distribution")

    plt.xlabel("Value")
    plt.ylabel("Probability")

    # start y-axis at 0
    plt.ylim(bottom=0)

    ax = plt.gca()
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1, decimals=2))

    plt.show()
    plt.close()
