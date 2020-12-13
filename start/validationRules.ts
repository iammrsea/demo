import { validator } from "@ioc:Adonis/Core/Validator";

validator.rule(
    "notLessThan50",
    (
        value: number,
        _,
        { pointer, arrayExpressionPointer, errorReporter }
    ) => {

        if (value < 50) {
            errorReporter.report(
                pointer,
                "notLessThan50",
                "You can't add amount less than 50 in your wallet",
                arrayExpressionPointer
            );
        }
    }
);