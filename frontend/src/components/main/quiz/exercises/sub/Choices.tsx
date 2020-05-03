import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Choice from "components/main/quiz/exercises/sub/Choice";
import { themeColors } from "components/core/CustomeTheme";
import { grey } from "@material-ui/core/colors";
import { ExerciseResult } from "types/ExerciseTypes";

type State = {
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  result: ExerciseResult;
  setResult: (result: ExerciseResult) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2, 0),
    },
  })
);

const labelColorsMap = new Map<string, any>([
  ["A", themeColors.primary],
  ["B", themeColors.secondary],
  ["C", themeColors.tertiary],
  ["D", themeColors.quaternary],
]);

const Choices: React.FC<State> = ({ choices, answer, result, setResult }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      {Array.from(labelColorsMap.keys()).map((label, i) => (
        <Choice
          key={label}
          color={labelColorsMap.get(label) ?? grey}
          label={label}
          text={choices[i]}
          isRight={answer === i}
          result={result}
          setResult={setResult}
        />
      ))}
    </Grid>
  );
};

export default Choices;
