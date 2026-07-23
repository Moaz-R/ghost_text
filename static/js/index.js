document.addEventListener('DOMContentLoaded', function () {

    function xz(u) {
        document.body.classList.remove('fade-in-page');
        document.body.classList.add('fade-out-page');

        setTimeout(function () {
            window.location.href = u;
        }, 400);
    }
    var b = document.getElementById('back-btn');
    if (b) {
        b.addEventListener('click', function (e) {
            e.preventDefault();
            var targetUrl = this.getAttribute('href');
            xz(targetUrl);
        });
    }

    var h = document.getElementById("hideBtn");
    var ex = document.getElementById("extractBtn");
    var hp = document.getElementById("helpBtn");
    var l = document.getElementById("langBtn");

    if (h) {
        h.addEventListener("click", function (e) {
            e.preventDefault();
            xz("hide-secret.html");
        });
    }

    if (ex) {
        ex.addEventListener("click", function (e) {
            e.preventDefault();
            xz("extract-secret.html");
        });
    }

    if (hp) {
        hp.addEventListener("click", function (e) {
            e.preventDefault();
            alert("GhostText helps you hide a secret message inside normal text using invisible Unicode characters.");
        });
    }

    if (l) {
        var te = document.getElementById("textEN");
        var ta = document.getElementById("textAR");
        l.addEventListener("click", function () {
            if (te) {
                if (ta) {
                    if (te.classList.contains("text-active")) {
                        te.classList.remove("text-active");
                        ta.classList.add("text-active");
                    } else {
                        ta.classList.remove("text-active");
                        te.classList.add("text-active");
                    }
                }
            }
        });
    }

    var ci = document.getElementById('coverFile');
    var si = document.getElementById('secretFile');
    var st = document.getElementById('secretText');
    var en = document.getElementById('encryptBtn');

    var tbs = document.querySelectorAll('.tab-btn');
    var ca = document.getElementById('cover-file-area');
    var sfa = document.getElementById('secret-file-area');
    var sta = document.getElementById('secret-text-area');

    var cc = document.querySelector('.upload-card');
    var sc = document.getElementById('secret-card');

    var mode = 'file';

    function goSlow(el, dur) {
        var rect = el.getBoundingClientRect();
        var top = rect.top;
        var sY = window.scrollY;
        var hH = window.innerHeight;
        var eH = el.offsetHeight;

        var pos = top + sY - (hH / 2) + (eH / 2);
        var start = window.scrollY;
        var dist = pos - start;
        var st = null;

        function step(ts) {
            if (st === null) {
                st = ts;
            }
            var elapsed = ts - st;
            var p = elapsed / dur;
            if (p > 1) {
                p = 1;
            }

            var ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

            window.scrollTo(0, start + (dist * ease));

            if (elapsed < dur) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    function checkReady() {
        if (!en) {
            return;
        }

        var cReady = false;
        if (ci.files.length > 0) {
            cReady = true;
        }

        var sReady = false;
        if (mode === 'file') {
            if (si.files.length > 0) {
                sReady = true;
            }
        } else {
            if (st) {
                if (st.value.trim().length > 0) {
                    sReady = true;
                }
            }
        }

        if (cReady == true) {
            if (sReady == true) {
                var wasDis = en.hasAttribute('disabled');

                en.removeAttribute('disabled');
                en.style.cursor = 'pointer';
                en.style.opacity = '1';

                if (wasDis) {
                    setTimeout(function () {
                        goSlow(en, 1200);

                        setTimeout(function () {
                            en.classList.add('pulse-glow-anim');

                            setTimeout(function () {
                                en.classList.remove('pulse-glow-anim');
                            }, 2000);
                        }, 600);

                    }, 200);
                }
                return;
            }
        }

        en.setAttribute('disabled', 'true');
        en.style.cursor = 'not-allowed';
        en.style.opacity = '0.5';
    }

    function fSize(bytes) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        var k = 1024;
        var sz = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        var val = bytes / Math.pow(k, i);
        return parseFloat(val.toFixed(1)) + ' ' + sz[i];
    }

    function refreshUI(inp, area) {
        if (!inp.files) {
            return;
        }
        if (inp.files.length === 0) {
            return;
        }
        var f = inp.files[0];

        var oIcon = area.querySelector('.upload-zone-icon');
        var oText = area.querySelector('.browse-text');
        if (oIcon) {
            oIcon.style.display = 'none';
        }
        if (oText) {
            oText.style.display = 'none';
        }

        var ex = area.querySelector('.file-uploaded-container');
        if (ex) {
            ex.remove();
        }

        var html = '<div class="file-uploaded-container"><div class="file-info-box"><i class="fas fa-file-alt file-info-icon"></i><div class="file-details"><span class="file-name" title="' + f.name + '">' + f.name + '</span><span class="file-size">' + fSize(f.size) + '</span></div><i class="fas fa-check-circle file-check"></i></div><span class="change-file-text">Change file</span></div>';

        area.insertAdjacentHTML('afterbegin', html);
        checkReady();
    }

    window.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);

    window.addEventListener("drop", function (e) {
        e.preventDefault();
    }, false);

    function setupDrag(area, inp) {
        if (!area) return;
        if (!inp) return;

        area.addEventListener('dragover', function (e) {
            e.preventDefault();
            area.style.borderColor = '#a78bfa';
            area.style.backgroundColor = 'rgba(167, 139, 250, 0.1)';
            area.style.transform = 'scale(1.02)';
        });

        area.addEventListener('dragleave', function (e) {
            e.preventDefault();
            area.style.borderColor = '';
            area.style.backgroundColor = '';
            area.style.transform = '';
        });

        area.addEventListener('drop', function (e) {
            e.preventDefault();
            area.style.borderColor = '';
            area.style.backgroundColor = '';
            area.style.transform = '';

            var fs = e.dataTransfer.files;

            if (fs.length > 0) {
                var dt = new DataTransfer();
                dt.items.add(fs[0]);
                inp.files = dt.files;
                refreshUI(inp, area);
            }
        });
    }

    setupDrag(ca, ci);
    setupDrag(sfa, si);

    if (tbs.length > 0) {
        tbs.forEach(function (t) {
            t.addEventListener('click', function (e) {
                e.stopPropagation();
                tbs.forEach(function (x) {
                    x.classList.remove('active');
                });
                t.classList.add('active');

                var targetAttr = t.dataset.target;
                if (targetAttr === 'file-upload') {
                    sfa.style.display = 'flex';
                    sta.style.display = 'none';
                    mode = 'file';
                } else {
                    sfa.style.display = 'none';
                    sta.style.display = 'block';
                    mode = 'text';
                }
                checkReady();
            });
        });
    }

    if (st) {
        st.addEventListener('input', function () {
            checkReady();
        });
        st.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    if (cc) {
        if (ci) {
            ci.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            cc.addEventListener('click', function () {
                ci.click();
            });
            ci.addEventListener('change', function () {
                refreshUI(ci, ca);
            });
        }
    }

    if (sc) {
        if (si) {
            si.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            sc.addEventListener('click', function () {
                if (mode === 'file') {
                    si.click();
                }
            });
            si.addEventListener('change', function () {
                refreshUI(si, sfa);
            });
        }
    }
});