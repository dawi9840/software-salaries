const { ref } = Vue;

const getEmployee = () => {
  return fetch('./employee.json').then((r) => r.json());
};

const salaryOptions = [
  {
    value: 1,
    label: '0 ~ 49999',
  },
  {
    value: 2,
    label: '50000 ~ 99999',
  },
  {
    value: 3,
    label: '100000 up',
  },
];

const App = {
  setup() {
    const loading = ref(true);
    const employee = ref([]);
    const employeeClone = ref([]);
    const companyValue = ref('');
    const companyOptions = ref([]);
    const salaryValue = ref('');

    const filterEmployee = (employeeClone, company, salary) => {
      let filteredEmployee = employeeClone;
      if (company) {
        filteredEmployee = filteredEmployee.filter(
          (e) => e.companyName === company
        );
      }
      if (salary) {
        switch (salary) {
          case 1:
            filteredEmployee = filteredEmployee.filter(
              (e) => e.monthlyBaseSalary < 5
            );
            break;
          case 2:
            filteredEmployee = filteredEmployee.filter(
              (e) => e.monthlyBaseSalary >= 5 && e.monthlyBaseSalary < 10
            );
            break;
          case 3:
            filteredEmployee = filteredEmployee.filter(
              (e) => e.monthlyBaseSalary >= 10
            );
            break;
        }
      }
      return filteredEmployee;
    };

    const companyChange = (company) => {
      salaryValue.value = '';
      employee.value = filterEmployee(employeeClone.value, company, null);
    };

    const salaryChange = (salary) => {
      companyValue.value = '';
      employee.value = filterEmployee(employeeClone.value, null, salary);
    };

    const init = async () => {
      try {
        let res = await getEmployee();
        companyOptions.value = [...new Set(res.map((e) => e.companyName))].map(
          (e) => {
            return {
              value: e,
              label: e,
            };
          }
        );
        employee.value = res;
        employeeClone.value = structuredClone(res);
      } finally {
        loading.value = false;
      }
    };

    init();
    return {
      employee,
      companyValue,
      companyOptions,
      companyChange,
      salaryValue,
      salaryOptions,
      salaryChange,
      loading,
    };
  },
};

const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount('#app');
