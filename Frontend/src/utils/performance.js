/**
 * Performance Monitoring Utility
 * Helps identify bottlenecks in the application
 */

export const initPerformanceMonitoring = () => {
  if (typeof window === "undefined") return;

  // Log performance metrics when page loads
  window.addEventListener("load", () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;
    const domReadyTime =
      perfData.domContentLoadedEventEnd - perfData.navigationStart;

    //console.log('⚡ Performance Metrics:');
    //console.log(`  Page Load Time: ${pageLoadTime}ms`);
    //console.log(`  DOM Ready Time: ${domReadyTime}ms`);
    //console.log(`  Connect Time: ${connectTime}ms`);
    //console.log(`  Render Time: ${renderTime}ms`);
  });

  // Monitor Core Web Vitals using Web Vitals API if available
  try {
    if ("PerformanceObserver" in window) {
      // Largest Contentful Paint
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          //console.log(`⚡ ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        }
      });
      paintObserver.observe({
        entryTypes: ["largest-contentful-paint", "paint"],
      });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.processingDuration !== undefined) {
            //console.log(`⚡ First Input Delay: ${entry.processingDuration.toFixed(2)}ms`);
          }
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
    }
  } catch (e) {
    // Performance API not available
  }
};

/**
 * Measure execution time of a function
 */
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  //console.log(`⚡ ${name} took ${(end - start).toFixed(2)}ms`);
  return result;
};

/**
 * Debounce function calls for expensive operations
 */
export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function calls to limit frequency
 */
export const throttle = (fn, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  initPerformanceMonitoring,
  measurePerformance,
  debounce,
  throttle,
};
