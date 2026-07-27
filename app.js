/* =========================================
   REDFINANCE
   CONTROL FINANCIERO PERSONAL
========================================= */


/* =========================================
   ESTADO DE LA APLICACIÓN
========================================= */

const defaultData = {

    dinero: [],

    movimientos: [],

    meDeben: [],

    debo: [],

    metas: []

};


let data =
    JSON.parse(
        localStorage.getItem("redFinanceData")
    ) || defaultData;


let currentModalType = null;

let editingId = null;


/* =========================================
   UTILIDADES
========================================= */

function saveData() {

    localStorage.setItem(
        "redFinanceData",
        JSON.stringify(data)
    );

}


function generateId() {

    return Date.now().toString();

}


function formatMoney(amount) {

    return new Intl.NumberFormat(
        "es-US",
        {
            style: "currency",
            currency: "PEN"
        }
    ).format(
        Number(amount) || 0
    );

}


function formatDate(date) {

    if (!date) return "-";

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "es-PE"
    );

}


/* =========================================
   CÁLCULO FINANCIERO
========================================= */

function calculateFinancialSummary() {

    const saldoInicial =
        data.dinero.reduce(
            (total, item) => {

                return total +
                    Number(item.monto || 0);

            },
            0
        );


    const ingresos =
        data.movimientos
            .filter(
                item =>
                    item.tipo === "ingreso"
            )
            .reduce(
                (total, item) => {

                    return total +
                        Number(item.monto || 0);

                },
                0
            );


    const gastos =
        data.movimientos
            .filter(
                item =>
                    item.tipo === "gasto"
            )
            .reduce(
                (total, item) => {

                    return total +
                        Number(item.monto || 0);

                },
                0
            );


    const dineroDisponible =
        saldoInicial +
        ingresos -
        gastos;


    const balance =
        ingresos -
        gastos;


    return {

        saldoInicial,

        ingresos,

        gastos,

        dineroDisponible,

        balance

    };

}


/* =========================================
   NAVEGACIÓN
========================================= */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


const sections =
    document.querySelectorAll(
        ".content-section"
    );


const pageTitle =
    document.getElementById(
        "pageTitle"
    );


navItems.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const sectionId =
                    button.dataset.section;

                openSection(
                    sectionId
                );

            }
        );

    }
);


document.querySelectorAll(
    "[data-section-link]"
).forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                openSection(
                    button.dataset.sectionLink
                );

            }
        );

    }
);


function openSection(sectionId) {

    sections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    navItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );

        }
    );


    const section =
        document.getElementById(
            sectionId
        );


    const nav =
        document.querySelector(
            `[data-section="${sectionId}"]`
        );


    if (section) {

        section.classList.add(
            "active"
        );

    }


    if (nav) {

        nav.classList.add(
            "active"
        );

        pageTitle.textContent =
            nav.innerText.trim();

    }


    closeMobileMenu();

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const summary =
        calculateFinancialSummary();


    document.getElementById(
        "dashboardAvailable"
    ).textContent =
        formatMoney(
            summary.dineroDisponible
        );


    document.getElementById(
        "dashboardInitial"
    ).textContent =
        formatMoney(
            summary.saldoInicial
        );


    document.getElementById(
        "dashboardIncome"
    ).textContent =
        formatMoney(
            summary.ingresos
        );


    document.getElementById(
        "dashboardExpense"
    ).textContent =
        formatMoney(
            summary.gastos
        );


    document.getElementById(
        "dashboardBalance"
    ).textContent =
        formatMoney(
            summary.balance
        );


    document.getElementById(
        "availableBalance"
    ).textContent =
        formatMoney(
            summary.dineroDisponible
        );


    updateChart(
        summary.ingresos,
        summary.gastos
    );


    renderRecentMovements();

    renderDashboardGoals();

}


/* =========================================
   GRÁFICO
========================================= */

function updateChart(
    ingresos,
    gastos
) {

    const total =
        ingresos +
        gastos;


    const incomeDegrees =
        total > 0
            ? (ingresos / total) * 360
            : 0;


    const chart =
        document.querySelector(
            ".donut-chart"
        );


    chart.style.background =
        `conic-gradient(
            var(--green)
            0deg
            ${incomeDegrees}deg,

            var(--primary)
            ${incomeDegrees}deg
            360deg
        )`;


    document.getElementById(
        "chartTotal"
    ).textContent =
        formatMoney(
            total
        );


    document.getElementById(
        "chartIncome"
    ).textContent =
        formatMoney(
            ingresos
        );


    document.getElementById(
        "chartExpense"
    ).textContent =
        formatMoney(
            gastos
        );

}


/* =========================================
   ÚLTIMOS MOVIMIENTOS
========================================= */

function renderRecentMovements() {

    const container =
        document.getElementById(
            "recentMovements"
        );


    const movements =
        [...data.movimientos]
            .sort(
                (a, b) =>
                    new Date(b.fecha) -
                    new Date(a.fecha)
            )
            .slice(
                0,
                5
            );


    if (
        movements.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ↕
                </div>

                <p>
                    Todavía no tienes movimientos.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        movements.map(
            movement => `

                <div class="movement-row">

                    <div>

                        <strong>
                            ${movement.descripcion}
                        </strong>

                        <span>
                            ${formatDate(
                movement.fecha
            )}
                        </span>

                    </div>

                    <strong
                        class="${movement.tipo === "ingreso"
                    ? "positive"
                    : "negative"
                }"
                    >
                        ${movement.tipo === "ingreso"
                    ? "+"
                    : "-"
                }
                        ${formatMoney(
                    movement.monto
                )}
                    </strong>

                </div>

            `
        ).join("");

}


/* =========================================
   DINERO
========================================= */

function renderMoney() {

    const container =
        document.getElementById(
            "moneyList"
        );


    if (
        data.dinero.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <p>
                    No tienes dinero inicial registrado.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        data.dinero.map(
            item => `

                <div class="info-card">

                    <div class="info-card-top">

                        <div>

                            <h3>
                                ${item.nombre}
                            </h3>

                            <p>
                                ${item.tipo}
                            </p>

                        </div>

                    </div>


                    <div class="amount">

                        ${formatMoney(
                item.monto
            )}

                    </div>


                    <div class="card-actions">

                        <button
                            class="small-button delete"
                            onclick="deleteItem(
                                'dinero',
                                '${item.id}'
                            )"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================
   MOVIMIENTOS
========================================= */

function renderMovements() {

    const container =
        document.getElementById(
            "movementTable"
        );


    const search =
        document.getElementById(
            "movementSearch"
        ).value.toLowerCase();


    const filter =
        document.getElementById(
            "movementFilter"
        ).value;


    let movements =
        data.movimientos.filter(
            item => {

                const matchesSearch =
                    item.descripcion
                        .toLowerCase()
                        .includes(
                            search
                        );


                const matchesFilter =
                    filter === "todos" ||
                    item.tipo === filter;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    movements.sort(
        (a, b) =>
            new Date(b.fecha) -
            new Date(a.fecha)
    );


    if (
        movements.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No hay movimientos registrados.

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        DESCRIPCIÓN
                    </th>

                    <th>
                        TIPO
                    </th>

                    <th>
                        CATEGORÍA
                    </th>

                    <th>
                        FECHA
                    </th>

                    <th>
                        MONTO
                    </th>

                    <th>
                        ACCIONES
                    </th>

                </tr>

            </thead>

            <tbody>

                ${movements.map(
        item => `

                        <tr>

                            <td>
                                <strong>
                                    ${item.descripcion}
                                </strong>
                            </td>

                            <td>

                                <span
                                    class="badge ${item.tipo === "ingreso"
                ? "badge-income"
                : "badge-expense"
            }"
                                >

                                    ${item.tipo === "ingreso"
                ? "Ingreso"
                : "Gasto"
            }

                                </span>

                            </td>

                            <td>
                                ${item.categoria}
                            </td>

                            <td>
                                ${formatDate(
                item.fecha
            )}
                            </td>

                            <td>

                                <strong
                                    class="${item.tipo === "ingreso"
                ? "positive"
                : "negative"
            }"
                                >

                                    ${item.tipo === "ingreso"
                ? "+"
                : "-"
            }

                                    ${formatMoney(
                item.monto
            )}

                                </strong>

                            </td>

                            <td>

                                <button
                                    class="small-button delete"
                                    onclick="deleteItem(
                                        'movimientos',
                                        '${item.id}'
                                    )"
                                >
                                    Eliminar
                                </button>

                            </td>

                        </tr>

                    `
    ).join("")}

            </tbody>

        </table>

    `;

}


/* =========================================
   ME DEBEN
========================================= */

function renderReceivables() {

    const container =
        document.getElementById(
            "receivableList"
        );


    const total =
        data.meDeben.reduce(
            (sum, item) =>
                sum +
                Number(item.monto),
            0
        );


    document.getElementById(
        "receivableTotal"
    ).textContent =
        formatMoney(
            total
        );


    if (
        data.meDeben.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No tienes cuentas por cobrar.

            </div>

        `;

        return;

    }


    container.innerHTML =
        data.meDeben.map(
            item => `

                <div class="info-card">

                    <h3>
                        ${item.persona}
                    </h3>

                    <p>
                        ${item.descripcion}
                    </p>

                    <div class="amount positive">

                        ${formatMoney(
                item.monto
            )}

                    </div>

                    <p>
                        ${formatDate(
                item.fecha
            )}
                    </p>

                    <div class="card-actions">

                        <button
                            class="small-button delete"
                            onclick="deleteItem(
                                'meDeben',
                                '${item.id}'
                            )"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================
   DEBO
========================================= */

function renderDebts() {

    const container =
        document.getElementById(
            "debtList"
        );


    const total =
        data.debo.reduce(
            (sum, item) =>
                sum +
                Number(item.monto),
            0
        );


    document.getElementById(
        "debtTotal"
    ).textContent =
        formatMoney(
            total
        );


    if (
        data.debo.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No tienes deudas registradas.

            </div>

        `;

        return;

    }


    container.innerHTML =
        data.debo.map(
            item => `

                <div class="info-card">

                    <h3>
                        ${item.persona}
                    </h3>

                    <p>
                        ${item.descripcion}
                    </p>

                    <div class="amount negative">

                        ${formatMoney(
                item.monto
            )}

                    </div>

                    <p>
                        ${formatDate(
                item.fecha
            )}
                    </p>

                    <div class="card-actions">

                        <button
                            class="small-button delete"
                            onclick="deleteItem(
                                'debo',
                                '${item.id}'
                            )"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================
   METAS
========================================= */

function renderGoals() {

    const container =
        document.getElementById(
            "goalsList"
        );


    if (
        data.metas.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No tienes metas creadas.

            </div>

        `;

        return;

    }


    container.innerHTML =
        data.metas.map(
            goal => {

                const percentage =
                    Math.min(
                        (
                            Number(goal.ahorrado) /
                            Number(goal.objetivo)
                        ) * 100,
                        100
                    );


                return `

                    <div class="info-card">

                        <h3>
                            ${goal.nombre}
                        </h3>

                        <div class="amount">

                            ${percentage.toFixed(0)}%

                        </div>

                        <div class="progress-bar">

                            <div
                                class="progress-fill"
                                style="
                                    width:
                                    ${percentage}%
                                "
                            ></div>

                        </div>

                        <div class="goal-values">

                            <span>
                                ${formatMoney(
                    goal.ahorrado
                )}
                            </span>

                            <span>
                                ${formatMoney(
                    goal.objetivo
                )}
                            </span>

                        </div>

                        <div class="card-actions">

                            <button
                                class="small-button delete"
                                onclick="deleteItem(
                                    'metas',
                                    '${goal.id}'
                                )"
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================
   METAS DASHBOARD
========================================= */

function renderDashboardGoals() {

    const container =
        document.getElementById(
            "dashboardGoals"
        );


    const goals =
        data.metas.slice(
            0,
            3
        );


    if (
        goals.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                Todavía no tienes metas de ahorro.

            </div>

        `;

        return;

    }


    container.innerHTML =
        goals.map(
            goal => {

                const percentage =
                    Math.min(
                        (
                            goal.ahorrado /
                            goal.objetivo
                        ) * 100,
                        100
                    );


                return `

                    <div class="goal-item">

                        <div class="goal-item-header">

                            <h4>
                                ${goal.nombre}
                            </h4>

                            <span>
                                ${percentage.toFixed(0)}%
                            </span>

                        </div>

                        <div class="progress-bar">

                            <div
                                class="progress-fill"
                                style="
                                    width:
                                    ${percentage}%
                                "
                            ></div>

                        </div>

                        <div class="goal-values">

                            <span>
                                ${formatMoney(
                    goal.ahorrado
                )}
                            </span>

                            <span>
                                ${formatMoney(
                    goal.objetivo
                )}
                            </span>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================
   MODAL
========================================= */

const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const formFields =
    document.getElementById(
        "formFields"
    );


function openModal(type) {

    currentModalType =
        type;

    editingId =
        null;


    const configs = {

        dinero: {

            title:
                "Agregar dinero inicial",

            fields: `

                <div class="form-group">

                    <label>
                        Nombre
                    </label>

                    <input
                        name="nombre"
                        placeholder="Ej. Cuenta BCP"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Tipo
                    </label>

                    <select name="tipo">

                        <option>
                            Efectivo
                        </option>

                        <option>
                            Cuenta bancaria
                        </option>

                        <option>
                            Billetera digital
                        </option>

                        <option>
                            Otro
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Monto
                    </label>

                    <input
                        type="number"
                        name="monto"
                        min="0"
                        step="0.01"
                        required
                    >

                </div>

            `

        },


        movimientos: {

            title:
                "Nuevo movimiento",

            fields: `

                <div class="form-group">

                    <label>
                        Tipo
                    </label>

                    <select
                        name="tipo"
                        required
                    >

                        <option value="ingreso">
                            Ingreso
                        </option>

                        <option value="gasto">
                            Gasto
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Descripción
                    </label>

                    <input
                        name="descripcion"
                        placeholder="Ej. Sueldo"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Categoría
                    </label>

                    <input
                        name="categoria"
                        placeholder="Ej. Trabajo"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Monto
                    </label>

                    <input
                        type="number"
                        name="monto"
                        min="0"
                        step="0.01"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Fecha
                    </label>

                    <input
                        type="date"
                        name="fecha"
                        required
                    >

                </div>

            `

        },


        meDeben: {

            title:
                "Registrar dinero que te deben",

            fields: `

                <div class="form-group">

                    <label>
                        Persona
                    </label>

                    <input
                        name="persona"
                        placeholder="Nombre"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Descripción
                    </label>

                    <input
                        name="descripcion"
                        placeholder="Ej. Préstamo"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Monto
                    </label>

                    <input
                        type="number"
                        name="monto"
                        min="0"
                        step="0.01"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Fecha
                    </label>

                    <input
                        type="date"
                        name="fecha"
                        required
                    >

                </div>

            `

        },


        debo: {

            title:
                "Registrar deuda",

            fields: `

                <div class="form-group">

                    <label>
                        Persona o empresa
                    </label>

                    <input
                        name="persona"
                        placeholder="Nombre"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Descripción
                    </label>

                    <input
                        name="descripcion"
                        placeholder="Ej. Préstamo"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Monto
                    </label>

                    <input
                        type="number"
                        name="monto"
                        min="0"
                        step="0.01"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Fecha
                    </label>

                    <input
                        type="date"
                        name="fecha"
                        required
                    >

                </div>

            `

        },


        metas: {

            title:
                "Nueva meta de ahorro",

            fields: `

                <div class="form-group">

                    <label>
                        Nombre de la meta
                    </label>

                    <input
                        name="nombre"
                        placeholder="Ej. Comprar laptop"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Objetivo
                    </label>

                    <input
                        type="number"
                        name="objetivo"
                        min="1"
                        step="0.01"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Dinero ahorrado
                    </label>

                    <input
                        type="number"
                        name="ahorrado"
                        min="0"
                        step="0.01"
                        value="0"
                        required
                    >

                </div>

            `

        }

    };


    const config =
        configs[type];


    modalTitle.textContent =
        config.title;


    formFields.innerHTML =
        config.fields;


    if (
        type === "movimientos" ||
        type === "meDeben" ||
        type === "debo"
    ) {

        const dateInput =
            formFields.querySelector(
                '[name="fecha"]'
            );


        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }


    modalOverlay.classList.add(
        "active"
    );

}


function closeModal() {

    modalOverlay.classList.remove(
        "active"
    );

    currentModalType =
        null;

    editingId =
        null;

}


/* =========================================
   GUARDAR FORMULARIO
========================================= */

document.getElementById(
    "modalForm"
).addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const formData =
            new FormData(
                event.target
            );


        const values =
            Object.fromEntries(
                formData.entries()
            );


        values.id =
            generateId();


        if (
            values.monto
        ) {

            values.monto =
                Number(
                    values.monto
                );

        }


        if (
            values.objetivo
        ) {

            values.objetivo =
                Number(
                    values.objetivo
                );

        }


        if (
            values.ahorrado
        ) {

            values.ahorrado =
                Number(
                    values.ahorrado
                );

        }


        data[
            currentModalType
        ].push(
            values
        );


        saveData();


        updateAll();


        closeModal();

    }
);


/* =========================================
   ELIMINAR
========================================= */

function deleteItem(
    collection,
    id
) {

    const confirmed =
        confirm(
            "¿Seguro que deseas eliminar este registro?"
        );


    if (!confirmed) return;


    data[collection] =
        data[collection].filter(
            item =>
                item.id !== id
        );


    saveData();


    updateAll();

}


/* =========================================
   BOTONES
========================================= */

document.getElementById(
    "addMoneyButton"
).addEventListener(
    "click",
    () => openModal("dinero")
);


document.getElementById(
    "addMovementButton"
).addEventListener(
    "click",
    () => openModal("movimientos")
);


document.getElementById(
    "quickMovementButton"
).addEventListener(
    "click",
    () => openModal("movimientos")
);


document.getElementById(
    "addReceivableButton"
).addEventListener(
    "click",
    () => openModal("meDeben")
);


document.getElementById(
    "addDebtButton"
).addEventListener(
    "click",
    () => openModal("debo")
);


document.getElementById(
    "addGoalButton"
).addEventListener(
    "click",
    () => openModal("metas")
);


document.getElementById(
    "modalClose"
).addEventListener(
    "click",
    closeModal
);


document.getElementById(
    "cancelModal"
).addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalOverlay
        ) {

            closeModal();

        }

    }
);


/* =========================================
   FILTROS
========================================= */

document.getElementById(
    "movementSearch"
).addEventListener(
    "input",
    renderMovements
);


document.getElementById(
    "movementFilter"
).addEventListener(
    "change",
    renderMovements
);


/* =========================================
   MODO OSCURO
========================================= */

const themeButton =
    document.getElementById(
        "themeButton"
    );


const savedTheme =
    localStorage.getItem(
        "redFinanceTheme"
    );


if (
    savedTheme === "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

    themeButton.textContent =
        "☀";

}


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        localStorage.setItem(
            "redFinanceTheme",
            isDark
                ? "dark"
                : "light"
        );


        themeButton.textContent =
            isDark
                ? "☀"
                : "☾";

    }
);


/* =========================================
   MENÚ MOBILE
========================================= */

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


mobileMenu.addEventListener(
    "click",
    () => {

        sidebar.classList.add(
            "open"
        );

        sidebarOverlay.classList.add(
            "active"
        );

    }
);


sidebarOverlay.addEventListener(
    "click",
    closeMobileMenu
);


function closeMobileMenu() {

    sidebar.classList.remove(
        "open"
    );

    sidebarOverlay.classList.remove(
        "active"
    );

}


/* =========================================
   EXPORTAR JSON
========================================= */

document.getElementById(
    "exportDataButton"
).addEventListener(
    "click",
    () => {

        const json =
            JSON.stringify(
                data,
                null,
                4
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "redfinance-backup.json";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


/* =========================================
   IMPORTAR JSON
========================================= */

document.getElementById(
    "importDataButton"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "importDataInput"
        ).click();

    }
);


document.getElementById(
    "importDataInput"
).addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) return;


        const reader =
            new FileReader();


        reader.onload =
            function () {

                try {

                    const importedData =
                        JSON.parse(
                            reader.result
                        );


                    if (
                        !importedData.dinero ||
                        !importedData.movimientos ||
                        !importedData.meDeben ||
                        !importedData.debo ||
                        !importedData.metas
                    ) {

                        throw new Error();

                    }


                    data =
                        importedData;


                    saveData();


                    updateAll();


                    alert(
                        "Datos importados correctamente."
                    );

                }
                catch {

                    alert(
                        "El archivo JSON no es válido."
                    );

                }

            };


        reader.readAsText(
            file
        );

    }
);


/* =========================================
   BORRAR DATOS
========================================= */

document.getElementById(
    "clearDataButton"
).addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Esta acción eliminará todos tus datos. ¿Continuar?"
            );


        if (!confirmed) return;


        data = {

            dinero: [],

            movimientos: [],

            meDeben: [],

            debo: [],

            metas: []

        };


        saveData();


        updateAll();


        alert(
            "Todos los datos fueron eliminados."
        );

    }
);


/* =========================================
   ACTUALIZAR TODA LA INTERFAZ
========================================= */

function updateAll() {

    updateDashboard();

    renderMoney();

    renderMovements();

    renderReceivables();

    renderDebts();

    renderGoals();

}


/* =========================================
   INICIAR APLICACIÓN
========================================= */

updateAll();