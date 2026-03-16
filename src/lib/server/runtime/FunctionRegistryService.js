import { validateFunctionRegistryDependencies } from "./contracts.js";

export class FunctionRegistryService {
  constructor({ endpoints, dirFn, fs, getFunctionsFiles }) {
    validateFunctionRegistryDependencies({ endpoints, dirFn, fs, getFunctionsFiles });
    this.endpoints = endpoints;
    this.dirFn = dirFn;
    this.fs = fs;
    this.getFunctionsFiles = getFunctionsFiles;
  }

  addBuiltInFunctions(fnSystem, fnPublic) {
    if (fnSystem) {
      if (fnSystem.fn_system_prd) {
        const entries = Object.entries(fnSystem.fn_system_prd);
        for (let [fName, fn] of entries) {
          this.appendAppFunction("system", "prd", fName, fn);
        }
      }

      if (fnSystem.fn_system_qa) {
        const entries = Object.entries(fnSystem.fn_system_qa);
        for (let [fName, fn] of entries) {
          this.appendAppFunction("system", "qa", fName, fn);
        }
      }

      if (fnSystem.fn_system_dev) {
        const entries = Object.entries(fnSystem.fn_system_dev);
        for (let [fName, fn] of entries) {
          this.appendAppFunction("system", "dev", fName, fn);
        }
      }
    }

    if (fnPublic) {
      if (fnPublic.fn_public_dev) {
        const entriesP = Object.entries(fnPublic.fn_public_dev);
        for (let [fName, fn] of entriesP) {
          this.appendAppFunction("public", "dev", fName, fn);
        }
      }
      if (fnPublic.fn_public_qa) {
        const entriesP = Object.entries(fnPublic.fn_public_qa);
        for (let [fName, fn] of entriesP) {
          this.appendAppFunction("public", "qa", fName, fn);
        }
      }
      if (fnPublic.fn_public_prd) {
        const entriesP = Object.entries(fnPublic.fn_public_prd);
        for (let [fName, fn] of entriesP) {
          this.appendAppFunction("public", "prd", fName, fn);
        }
      }
    }
  }

  loadFunctionFiles() {
    const createFnPath = (fn_path) => {
      try {
        if (!this.fs.existsSync(fn_path)) {
          this.fs.mkdirSync(fn_path, { recursive: true });
        } else {
          console.log("La ruta ya existe.");
        }
      } catch (error) {
        console.error(error);
      }
      return fn_path;
    };

    createFnPath(`${this.dirFn}/system/dev`);
    createFnPath(`${this.dirFn}/system/qa`);
    createFnPath(`${this.dirFn}/system/prd`);

    createFnPath(`${this.dirFn}/public/dev`);
    createFnPath(`${this.dirFn}/public/qa`);
    createFnPath(`${this.dirFn}/public/prd`);

    this.getFunctionsFiles(this.dirFn).forEach((data_js) => {
      this.appendFunctionsFile(
        data_js.file,
        data_js.data.appName,
        data_js.data.environment,
      );
    });
  }

  async appendFunctionsFile(file_app, _app_name, environment) {
    try {
      console.log("Load Module -> ", file_app);

      const fname = file_app.split("/").pop();
      const stat_mod = this.fs.statSync(file_app);

      if (
        stat_mod.isFile() &&
        fname.endsWith(".js") &&
        fname.startsWith("fn")
      ) {
        console.log("Es un archivo:", fname);

        const taskModule = await import(file_app);

        console.log("Module: ", taskModule);

        if (taskModule && taskModule.default) {
          this.appendAppFunction(
            _app_name,
            environment,
            fname.replace(".js", ""),
            taskModule.default,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  appendAppFunction(appname, environment, functionName, fn) {
    if (functionName.startsWith("fn")) {
      if (!this.endpoints.fnLocal[environment]) {
        this.endpoints.fnLocal[environment] = {};
      }

      if (!this.endpoints.fnLocal[environment][appname]) {
        this.endpoints.fnLocal[environment][appname] = {};
      }

      this.endpoints.fnLocal[environment][appname][functionName] = fn;
    } else {
      throw `The function must start with "fn". appName: ${appname} - functionName: ${functionName}.`;
    }
  }

  getFunctions(appName, environment) {
    let d;
    let p;

    if (this.endpoints.fnLocal[environment]) {
      d = this.endpoints.fnLocal[environment][appName];
      p = this.endpoints.fnLocal[environment]["public"];
    }

    return { ...p, ...d };
  }
}
