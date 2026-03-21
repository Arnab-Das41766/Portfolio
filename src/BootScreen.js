import React, { useState, useEffect } from 'react';

const KERNEL_LOGS = [
  '[    0.000000] Linux version 5.15.0-generic (buildd@lcy02-amd64-071) (gcc (Ubuntu 11.2.0-19ubuntu1) 11.2.0, GNU ld (GNU Binutils for Ubuntu) 2.38) #1 SMP',
  '[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-5.15.0-generic root=UUID=123x ro quiet splash',
  '[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: \\\'x87 floating point registers\\\'',
  '[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: \\\'SSE registers\\\'',
  '[    0.000000] x86/fpu: Supporting XSAVE feature 0x004: \\\'AVX registers\\\'',
  '[    0.000000] x86/fpu: xstate_offset[2]:  576, xstate_sizes[2]:  256',
  '[    0.000000] x86/fpu: Enabled xstate features 0x7, context size is 832 bytes, using \\\'standard\\\' format.',
  '[    0.000000] BIOS-provided physical RAM map:',
  '[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable',
  '[    0.000000] BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved',
  '[    0.000000] BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved',
  '[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x00000000bffdffff] usable',
  '[    0.013400] secureboot: Secure boot disabled',
  '[    0.013400] random: get_random_bytes called from start_kernel+0x310/0x52e with crng_init=0',
  '[    0.016335] DMI: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.14.0-2 04/01/2014',
  '[    0.016335] Hypervisor detected: KVM',
  '[    0.020000] kvm-clock: Using msrs 4b564d01 and 4b564d00',
  '[    0.020000] kvm-clock: cpu 0, msr 0:3fea9001, primary cpu clock',
  '[    0.020000] kvm-clock: using sched offset of 3433617350',
  '[    0.024000] clocksource: kvm-clock: mask: 0xffffffffffffffff max_cycles: 0x1cd42e4dffb, max_idle_ns: 881590591483 ns',
  '[    0.026000] tsc: Fast TSC calibration using PIT',
  '[    0.027000] tsc: Detected 2112.000 MHz processor',
  '[    0.029000] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved',
  '[    0.029000] e820: remove [mem 0x000a0000-0x000fffff] usable',
  '[    0.203000] Mount-cache hash table entries: 16384 (order: 5, 131072 bytes, linear)',
  '[    0.203000] Mountpoint-cache hash table entries: 16384 (order: 5, 131072 bytes, linear)',
  '[    0.231000] CPU: Physical Processor ID: 0',
  '[    0.231000] CPU: Processor Core ID: 0',
  '[    0.231000] mce: CPU supports 8 MCE banks',
  '[    0.244000] spec_store_bypass: Mitigation: Speculative Store Bypass disabled via prctl and seccomp',
  '[    0.342000] PCI: Using configuration type 1 for base access',
  '[    0.412000] Initializing cgroup subsys memory',
  '[    0.412000] Initializing cgroup subsys devices',
  '[    0.412000] Initializing cgroup subsys freezer',
  '[    0.430000] Freeing SMP alternatives memory: 32K',
  '[    0.450000] smpboot: CPU0: Intel(R) Xeon(R) CPU @ 2.20GHz (family: 0x6, model: 0x4f, stepping: 0x0)',
  '[    0.456000] Performance Events: unsupported p6 CPU model 79 no PMU driver, software events only.',
  '[    0.460000] signal: max sigframe size: 1776',
  '[    0.470000] rcu: Hierarchical RCU implementation.',
  '[    0.470000] rcu:     RCU event tracing is enabled.',
  '[    0.470000] rcu:     RCU restricting CPUs from NR_CPUS=8192 to nr_cpu_ids=2.',
  '[    1.000000] Starting system services...',
  '[  OK  ] Started User Login Management.',
  '[  OK  ] Reached target Graphical Interface.',
  '[  OK  ] Started GNOME Display Manager.'
];

export default function BootScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let currentLogIndex = 0;
    let intervalId;

    const pushLog = () => {
      if (currentLogIndex < KERNEL_LOGS.length) {
        setLogs(prev => [...prev, KERNEL_LOGS[currentLogIndex]]);
        currentLogIndex++;
        
        // Randomize the typing speed to make it look like real booting
        const delay = Math.random() * 50 + 10;
        intervalId = setTimeout(pushLog, delay);
      } else {
        // Finished booting
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    };

    pushLog();

    return () => clearTimeout(intervalId);
  }, [onComplete]);

  return (
    <div style={{
      width: '100vw', height: '100vh', backgroundColor: '#000', color: '#fff',
      fontFamily: '"Courier New", Courier, monospace', fontSize: '13px',
      padding: '20px', boxSizing: 'border-box', overflow: 'hidden',
      display: 'flex', flexDirection: 'column'
    }}>
      {logs.map((log, index) => (
        <div key={index} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.2' }}>{log}</div>
      ))}
      <div style={{ marginTop: '10px' }} className="blink-cursor">_</div>

      <style>{`
        .blink-cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
