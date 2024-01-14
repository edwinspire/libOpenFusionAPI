export default async ($_REQUEST_, $_DATA) => {
  let r = { status: 500, data: undefined };

  if ($_DATA && $_DATA.num_a && $_DATA.num_b) {
    r.status = 200;
    r.data = { result: Number($_DATA.num_a) + Number($_DATA.num_b) };
  } else {
    r.status = 400;
    r.data = { error: "Parameters num_a and num_b are required. " };
  }

  return r;
};
