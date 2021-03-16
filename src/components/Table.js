import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import "./Table.css";
const useStyles = makeStyles({
  container: {
    maxHeight: "22em",
  },
});
function CountryTable({ countries }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const columns = [
    { id: "name", label: "Name", minWidth: 100 },
    {
      id: "confirmed",
      label: "Confirmed",
      minWidth: 100,
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "active",
      label: "Active",
      minWidth: 100,
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "recovered",
      label: "Recovered",
      minWidth: 100,
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "deceased",
      label: "Deceased",
      minWidth: 100,
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];
  function createData(name, cases, active, recovered, deaths) {
    cases = Number(cases).toLocaleString();
    active = Number(active).toLocaleString();
    recovered = Number(recovered).toLocaleString();
    deaths = Number(deaths).toLocaleString();
    return { name, cases, active, recovered, deaths };
  }
  const rows = [
    countries.map(({ country, cases, active, recovered, deaths }) => {
      return createData(country, cases, active, recovered, deaths);
    }),
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <div className="table">
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  className="table__cell"
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows[0]
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell
                      className="table__cell"
                      component="th"
                      scope="row"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell className="table__cell" align="right">
                      {row.cases}
                    </TableCell>
                    <TableCell className="table__cell" align="right">
                      {row.active}
                    </TableCell>
                    <TableCell className="table__cell" align="right">
                      {row.recovered}
                    </TableCell>
                    <TableCell className="table__cell" align="right">
                      {row.deaths}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[7, 10, 25, 50, 100]}
        component="div"
        count={rows[0].length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default CountryTable;
