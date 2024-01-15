export default async ($_REQUEST_, $_DATA) => {
  let r = { code: 500, data: undefined };

  if ($_DATA && $_DATA.num_a && $_DATA.num_b) {
    r.code = 200;
    r.data = { result: $_DATA.num_a + $_DATA.num_b };
  } else {
    r.code = 400;
    r.data = { error: "Parameters num_a and num_b are required. " };
  }

  return r;
};
