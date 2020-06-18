import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Avatar, Grid, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexBasis: "250px",
      maxWidth: "300px",
      minWidth: "220px",
      flexGrow: 1,
      [theme.breakpoints.down("xs")]: {
        flexBasis: "250px",
        maxWidth: "350px",
      },
    },
    media: {
      height: 140,
    },
    selected: {
      border: "1px solid",
      boxSizing: "border-box",
      borderColor: "#4285f4",
      borderRadius: theme.spacing(1),
      backgroundColor: "#e8f0fe",
    },
  })
);

type Props = {
  title: string;
  imgPath: string;
  author: string;
  authorImgPath: string;
  handleClick: () => any;
  isSelected: boolean;
};

const Item: React.FC<Props> = ({
  title,
  imgPath,
  author,
  authorImgPath,
  handleClick,
  isSelected,
}) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, isSelected && classes.selected)}
      onClick={handleClick}
    >
      <CardActionArea>
        <CardMedia className={classes.media} image={imgPath} title={title} />
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Avatar alt={author} src={authorImgPath} />
            </Grid>
            <Grid item xs={9}>
              <Typography gutterBottom variant="subtitle2" component="h4">
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {author}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Item;
