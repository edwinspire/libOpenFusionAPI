import os from "os";
import { execSync } from "child_process";
import si from "systeminformation";

// Instala primero: npm install systeminformation

/**
 * Obtiene información detallada del sistema
 */
export async function getSystemInfoDynamic() {
  try {
    // 4. Uso de CPU y memoria
    const cpuUsage = await si.currentLoad();
    const memUsage = await si.mem();

    return {
      cpuUsage: ConvertStringToNumber(cpuUsage.currentLoad.toFixed(2)), // %

      // Información de memoria
      totalMemory: ConvertStringToNumber((memUsage.total / (1024 * 1024 * 1024)).toFixed(2)), // GB
      freeMemory: ConvertStringToNumber((memUsage.free / (1024 * 1024 * 1024)).toFixed(2)), // GB
      usedMemory: ConvertStringToNumber((memUsage.used / (1024 * 1024 * 1024)).toFixed(2)), // GB
      memoryUsage: ConvertStringToNumber(((memUsage.used / memUsage.total) * 100).toFixed(2)), // %
    };
  } catch (error) {
    console.error("Error al obtener información del sistema:", error);
    return {
      error: "No se pudo obtener la información del sistema",
      details: error.message,
    };
  }
}

function ConvertStringToNumber(str){
return parseFloat(str);
};

export async function getSystemInfoStatic() {
  try {
    // 1. Versión de Node.js
    const nodeVersion = process.version;

    // 2. Nombre de la máquina
    const hostname = os.hostname();

    // 3. Dirección IP de la máquina (no loopback)
    const interfaces = os.networkInterfaces();
    let localIp = "N/A";
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
      if (localIp !== "N/A") break;
    }

    // 5. Tiempo encendido (uptime)
    const uptime = os.uptime();
    const uptimeDays = Math.floor(uptime / 86400);
    const uptimeHours = Math.floor((uptime % 86400) / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);

    // 6. Fecha de inicio (calculada con uptime)
    const now = new Date();
    const startTime = new Date(now.getTime() - uptime * 1000);

    // 7. Información del sistema operativo
    const platform = os.platform();
    const arch = os.arch();
    const release = os.release();

    // 8. Información del procesador
    const cpuInfo = await si.cpu();
    const cpuManufacturer = cpuInfo.manufacturer;
    const cpuModel = cpuInfo.model;
    const cpuCores = cpuInfo.cores;
    const cpuSpeed = cpuInfo.speed;

    return {
      // Información básica
      nodeVersion,
      hostname,
      localIp,
      platform,
      architecture: arch,
      osRelease: release,

      // Información del CPU
      cpuManufacturer,
      cpuModel,
      cpuCores,
      cpuSpeed: `${cpuSpeed} GHz`,

      // Tiempo encendido
      uptime: {
        totalSeconds: uptime,
        days: uptimeDays,
        hours: uptimeHours,
        minutes: uptimeMinutes,
        startTime: startTime.toISOString(),
        formatted: `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`,
      },

      // Fecha y hora actual
      currentTime: now.toISOString(),
    };
  } catch (error) {
    console.error("Error al obtener información del sistema:", error);
    return {
      error: "No se pudo obtener la información del sistema",
      details: error.message,
    };
  }
}

/*
// Ejemplo de uso
(async () => {
  const systemInfo = await getSystemInfo();
  console.log(systemInfo);
})();
*/
