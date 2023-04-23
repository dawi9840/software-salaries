const { ref } = Vue;

const getEmployee = () => {
  return fetch('./employee.json').then((r) => r.json());
};

const App = {
  setup() {
    const loading = ref(true);
    const employee = ref([]);
    const employeeClone = ref([]);
    const companyValue = ref('');
    const companyOptions = ref([]);
    const salaryValue = ref('');
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

    const companyChange = (company) => {
      salaryValue.value = '';
      if (!company) return (employee.value = employeeClone.value);
      employee.value = employeeClone.value.filter(
        (e) => e.companyName === company
      );
    };

    const salaryChange = (salary) => {
      companyValue.value = '';
      if (!salary) return (employee.value = employeeClone.value);
      employee.value = employeeClone.value.filter((e) => {
        switch (salary) {
          case 1:
            return e.monthlyBaseSalary < 5;
          case 2:
            return e.monthlyBaseSalary >= 5 && e.monthlyBaseSalary < 10;
          case 3:
            return e.monthlyBaseSalary >= 10;
        }
      });
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
