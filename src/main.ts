import "./style.css";

interface CalculatorInterface {
  tempValue: string | number;
  tempOperator?: Operator | string;
  render(inputValue: string | number): void;
  reset(): void;
  calculate(operator: Operator | string): void;
  initEvent(): void;
}
type ComputedValue = {
  [key in Exclude<Operator, "=">]: (num1: number, num2: number) => number;
};
type Operator = "+" | "-" | "×" | "÷" | "=";
const VALID_NUMBER_OF_DIGITS = 3;
const INIT_VALUE = 0;
const OPERATORS = ["+", "-", "×", "÷"];
const validateNumberLength = (value: string | number) => {
  return String(value).length < VALID_NUMBER_OF_DIGITS;
};
const isZero = (value: string) => {
  return Number(value) === 0;
};
const getComputedValue: ComputedValue = {
  "+": (num1, num2) => num1 + num2,
  "-": (num1, num2) => num1 - num2,
  "×": (num1, num2) => num1 * num2,
  "÷": (num1, num2) => Number((num1 / num2).toFixed(3))
};
const Calculrator: CalculatorInterface = {
  tempValue: 0,
  tempOperator: undefined,
  render(inputValue?: string | number) {
    const resultEl = <HTMLDivElement>document.querySelector("#result");
    const prevValue = resultEl.innerText;
    if (!validateNumberLength(prevValue)) {
      alert("3자리 이상 숫자를 입력하실 수 없습니다");
      return;
    }
    resultEl.innerText = isZero(prevValue)
      ? String(inputValue)
      : String(prevValue + inputValue);
  },
  reset() {
    const resultEl = <HTMLDivElement>document.querySelector("#result");
    resultEl.innerText = String(INIT_VALUE);
    this.tempValue = 0;
    this.tempOperator = undefined;
  },

  calculate(operator: Operator | string) {
    const isReadyCalculated =
      operator === "=" &&
      this.tempOperator &&
      OPERATORS.includes(this.tempOperator);
    const isTempCalculate = OPERATORS.includes(operator);
    if (isTempCalculate) {
      const resultEl = <HTMLDivElement>document.querySelector("#result");
      this.tempOperator = operator;
      this.tempValue = Number(resultEl.innerText);
      resultEl.innerText = String(INIT_VALUE);
      return;
    }

    if (isReadyCalculated) {
      const resultEl = <HTMLDivElement>document.querySelector("#result");
      const resultValue = getComputedValue[
        this.tempOperator as Exclude<Operator, "=">
      ](Number(this.tempValue), Number(resultEl.innerText));
      resultEl.innerText = String(resultValue);
    }
  },
  initEvent() {
    const buttonContainerEl = document.querySelector(".contents");
    buttonContainerEl?.addEventListener("click", ({ target }) => {
      const buttonText = (target as HTMLDivElement).innerText;
      if (buttonText === "AC") {
        this.reset();
        return;
      }
      if (OPERATORS.concat("=").includes(buttonText)) {
        this.calculate(buttonText);
        return;
      }
      if (!isNaN(+buttonText)) this.render(+buttonText);
    });
  },
};
Calculrator.render(INIT_VALUE);
Calculrator.initEvent();
