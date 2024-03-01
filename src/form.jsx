import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import { useState } from "react";

const schema = yup.object().shape({
  label: yup.string().required("Required").trim(),
  required: yup.boolean().required(),
  default: yup.string().required("Required").trim(),
  choices: yup.array().of(yup.string()).min(1).max(50),
  displayAlpha: yup.number().required(),
});

const defaultValues = {
  label: "",
  required: false,
  default: "",
  choices: [],
  displayAlpha: 1,
};

export default function DemoForm() {
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const watchChoices = watch("choices");

  function onSave(data) {
    const isDefaultIsPresent = data.choices.find(
      (c) => c === data.default.trim()
    );

    if (!isDefaultIsPresent) {
      alert("default value should be present in the choice");
      return;
    }
    const reqBody = { ...data, displayAlpha: data.displayAlpha === 1 };

    const url = "http://www.mocky.io/v2/566061f21200008e3aabd919";
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false);
      });

    console.log(reqBody);
  }

  // handles addition of new choices
  // and also provides validation before addition
  function handleAddChoice() {
    const enterDefault = getValues("default");
    if (!enterDefault.trim()) {
      alert("Enter text before add");
      return;
    }

    if (watchChoices.length == 50) {
      alert("Cannot enter more than 50 choices");
      return;
    }

    const isDuplicate = watchChoices.find((c) => c === enterDefault.trim());
    if (isDuplicate) {
      alert("Enter text is already present in the choice list");
      setValue("default", "");
      return;
    }

    setValue("choices", [...getValues("choices"), enterDefault]);
  }

  function handleChoiceDelete(choice) {
    const filterChoices = watchChoices.filter(
      (elChoice) => elChoice !== choice
    );
    setValue("choices", filterChoices);
  }

  function handleChoiceOrdering(order) {
    const choicesCopy = [...watchChoices];
    if (order === 1) {
      choicesCopy.sort((a, b) => a.localeCompare(b));
    }
    setValue("choices", choicesCopy);
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSave)}>
        <Box border="1px solid skyblue" borderRadius="0.5em" mt={15}>
          <Box
            bgcolor="#beecff"
            py={2}
            borderRadius="0.5em 0.5em 0 0"
            borderBottom="1px solid skyblue"
          >
            <Typography variant="h6" pl={3} color="#005678">
              Field Builder
            </Typography>
          </Box>
          <Box p={3}>
            <Grid container spacing={{ xs: 1, sm: 1, md: 3 }}>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography>Label</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={8}>
                <Controller
                  control={control}
                  name="label"
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <TextField
                        fullWidth
                        size="small"
                        {...field}
                        helperText={error?.message}
                        error={!!error}
                        inputProps={{ maxLength: 40 }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography>Type</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={8}>
                <Typography component="span" sx={{ mr: 3 }}>
                  Multi-select
                </Typography>
                <Controller
                  control={control}
                  name="required"
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label="A Value is required"
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography>Default Value</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={8}>
                <Controller
                  control={control}
                  name="default"
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <TextField
                        size="small"
                        {...field}
                        helperText={error?.message}
                        error={!!error}
                        inputProps={{ maxLength: 40 }}
                      />
                    );
                  }}
                />
                <Button
                  color="primary"
                  onClick={handleAddChoice}
                  sx={{
                    "&.MuiButton-root": {
                      textTransform: "capitalize",
                      height: 40,
                    },
                    ml: 2,
                  }}
                  variant="outlined"
                >
                  <Add /> <Typography>Add</Typography>
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography>Choices</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={8}>
                {!watchChoices.length ? (
                  <>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Please add some choices from the default values input
                        field by clicking the <b>Add</b> button.
                      </Typography>
                    </Box>
                    {errors.choices && (
                      <FormHelperText error={!!errors.choices}>
                        {" "}
                        {errors.choices?.message}
                      </FormHelperText>
                    )}
                  </>
                ) : (
                  <List
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    {watchChoices.map((choice) => (
                      <ListItem
                        key={choice}
                        disablePadding
                        secondaryAction={
                          <IconButton
                            size="small"
                            edge="end"
                            tittle="Delete"
                            aria-label="delete"
                            color="error"
                            onClick={() => handleChoiceDelete(choice)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <ListItemButton
                          dense
                          title="Delete choice"
                          onClick={() => handleChoiceDelete(choice)}
                        >
                          <ListItemText primary={choice} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography>Order</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={8}>
                <Controller
                  control={control}
                  name="displayAlpha"
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <FormControl error={error} size="small" fullWidth>
                        <Select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleChoiceOrdering(e.target.value);
                          }}
                        >
                          <MenuItem value={1}>
                            Display Choice in Alphabetical order
                          </MenuItem>
                          <MenuItem value={0}>No Order</MenuItem>
                        </Select>
                        <FormHelperText>{error?.message}</FormHelperText>
                      </FormControl>
                    );
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4} lg={4}></Grid> */}
              <Grid item xs={12} sm={6} md={8} lg={8}>
                <Stack direction="row" alignItems="center">
                  <Button
                    variant="contained"
                    disabled={loading}
                    type="submit"
                    sx={{
                      "&.MuiButton-root": {
                        textTransform: "capitalize",
                        backgroundColor: "#4fb725",
                      },
                      mr: 2,
                    }}
                  >
                    {loading && <CircularProgress size={24} />}
                    Save Changes
                  </Button>

                  <Button
                    disabled={loading}
                    variant="outlined"
                    color="error"
                    onClick={() => reset()}
                    sx={{ "&.MuiButton-root": { textTransform: "capitalize" } }}
                  >
                    Cancel/Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </Container>
  );
}
