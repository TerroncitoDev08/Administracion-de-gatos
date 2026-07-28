const STORAGE_KEY = "redfinance_data";

const defaultData = {

    movements: [],

    owedToMe: [],

    iOwe: [],

    goals: []

};

let data = loadData();

function loadData() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);

    if (!savedData) {

        return {
            ...defaultData
        };

    }

    try {

        const parsed =
            JSON.parse(savedData);

        return {

            ...defaultData,

            ...parsed,

            movements:
                parsed.movements || [],

            owedToMe:
                parsed.owedToMe || [],

            iOwe:
                parsed.iOwe || [],

            goals:
                parsed.goals || []

        };

    } catch (error) {

        console.error(
            "Error al cargar datos:",
            error
        );

        return {
            ...defaultData
        };

    }

}

function saveData() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

function formatMoney(amount) {

    return new Intl.NumberFormat(
        "es-PE",
        {
            style: "currency",
            currency: "PEN"
        }
    ).format(Number(amount) || 0);

}

function formatDate(date) {

    if (!date) {
        return "";
    }

    const d =
        new Date(
            `${date}T00:00:00`
        );

    return d.toLocaleDateString(
        "es-PE",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

function generateId() {

    return Date.now().toString()
        + Math.random()
            .toString(36)
            .substring(2, 9);

}

const navItems =
    document.querySelectorAll(".nav-item[data-section]");

const sections =
    document.querySelectorAll(".content-section");

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");

const sectionTitles = {

    dashboard: [
        "Dashboard",
        "Resumen general de tus finanzas"
    ],

    movimientos: [
        "Movimientos",
        "Control de ingresos y gastos"
    ],

    meDeben: [
        "Me deben",
        "Controla tus cuentas por cobrar"
    ],

    debo: [
        "Debo",
        "Controla tus cuentas por pagar"
    ],

    metas: [
        "Metas de ahorro",
        "Alcanza tus objetivos financieros"
    ],

    estadisticas: [
        "Estadísticas",
        "Analiza tus finanzas"
    ],

    configuracion: [
        "Configuración",
        "Administra tus datos"
    ]

};

function showSection(sectionName) {

    sections.forEach(section => {

        section.classList.remove("active");

    });

    const target =
        document.getElementById(
            `section-${sectionName}`
        );

    if (target) {

        target.classList.add("active");

    }

    navItems.forEach(item => {

        item.classList.remove("active");

        if (
            item.dataset.section === sectionName
        ) {

            item.classList.add("active");

        }

    });

    if (sectionTitles[sectionName]) {

        pageTitle.textContent =
            sectionTitles[sectionName][0];

        pageSubtitle.textContent =
            sectionTitles[sectionName][1];

    }

    closeSidebar();

}

navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            showSection(
                item.dataset.section
            );

        }
    );

});

document
    .querySelectorAll(
        "[data-section-target]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showSection(
                    button.dataset.sectionTarget
                );

            }
        );

    });

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );

mobileMenuButton.addEventListener(
    "click",
    () => {

        sidebar.classList.add("open");

        sidebarOverlay.classList.add("active");

    }
);

sidebarOverlay.addEventListener(
    "click",
    closeSidebar
);

function closeSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove(
        "active"
    );

}

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const savedTheme =
    localStorage.getItem(
        "redfinance_theme"
    );

if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

}

themeToggle.addEventListener(
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

            "redfinance_theme",

            isDark
                ? "dark"
                : "light"

        );

        updateThemeButton();

        updateCharts();

    }
);

function updateThemeButton() {

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );

    themeToggle.innerHTML = `

        <span class="nav-icon">
            ${isDark ? "☀" : "☾"}
        </span>

        <span>
            ${isDark
            ? "Modo claro"
            : "Modo oscuro"
        }
        </span>

    `;

}

updateThemeButton();

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}

function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}

document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                closeModal(
                    button.dataset.closeModal
                );

            }
        );

    });

document
    .querySelectorAll(
        ".modal-overlay"
    )
    .forEach(overlay => {

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    overlay.classList.remove(
                        "active"
                    );

                }

            }
        );

    });

const movementForm =
    document.getElementById(
        "movementForm"
    );

const movementModal =
    document.getElementById(
        "movementModal"
    );

document
    .getElementById(
        "addMovementButton"
    )
    .addEventListener(
        "click",
        () => {

            resetMovementForm();

            openModal(
                "movementModal"
            );

        }
    );

document
    .getElementById(
        "quickAddButton"
    )
    .addEventListener(
        "click",
        () => {

            resetMovementForm();

            openModal(
                "movementModal"
            );

        }
    );

movementForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const id =
            document.getElementById(
                "movementId"
            ).value;

        const movement = {

            id:
                id || generateId(),

            type:
                document.getElementById(
                    "movementType"
                ).value,

            description:
                document.getElementById(
                    "movementDescription"
                ).value.trim(),

            amount:
                Number(
                    document.getElementById(
                        "movementAmount"
                    ).value
                ),

            category:
                document.getElementById(
                    "movementCategory"
                ).value,

            date:
                document.getElementById(
                    "movementDate"
                ).value

        };

        if (id) {

            const index =
                data.movements.findIndex(
                    item =>
                        item.id === id
                );

            if (index !== -1) {

                data.movements[index] =
                    movement;

            }

        } else {

            data.movements.unshift(
                movement
            );

        }

        saveData();

        closeModal(
            "movementModal"
        );

        renderAll();

    }
);

function resetMovementForm() {

    movementForm.reset();

    document.getElementById(
        "movementId"
    ).value = "";

    document.getElementById(
        "movementDate"
    ).value =
        new Date()
            .toISOString()
            .split("T")[0];

    document.getElementById(
        "movementType"
    ).value = "income";

}

function renderMovements() {

    const container =
        document.getElementById(
            "movementsList"
        );

    const search =
        document.getElementById(
            "movementSearch"
        ).value
            .toLowerCase();

    const filter =
        document.getElementById(
            "movementFilter"
        ).value;

    let movements =
        [...data.movements];

    if (filter !== "all") {

        movements =
            movements.filter(
                movement =>
                    movement.type === filter
            );

    }

    if (search) {

        movements =
            movements.filter(
                movement =>
                    movement.description
                        .toLowerCase()
                        .includes(search)
            );

    }

    if (
        movements.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No hay movimientos
                registrados.

            </div>

        `;

        return;

    }

    container.innerHTML =
        movements.map(
            movement => `

            <div class="movement-item">

                <div class="movement-info">

                    <div class="
                        movement-icon
                        ${movement.type}
                    ">

                        ${movement.type === "income"
                    ? "↑"
                    : "↓"
                }

                    </div>

                    <div>

                        <h4>
                            ${escapeHTML(
                    movement.description
                )}
                        </h4>

                        <span>

                            ${formatDate(
                    movement.date
                )}
                            ·
                            ${movement.category}

                        </span>

                    </div>

                </div>

                <div class="movement-right">

                    <strong class="
                        movement-amount
                        ${movement.type}
                    ">

                        ${movement.type === "income"
                    ? "+"
                    : "-"
                }

                        ${formatMoney(
                    movement.amount
                )}

                    </strong>

                    <div class="item-actions">

                        <button
                            class="small-button"
                            onclick="
                                editMovement(
                                    '${movement.id}'
                                )
                            "
                        >
                            Editar
                        </button>

                        <button
                            class="small-button"
                            onclick="
                                deleteMovement(
                                    '${movement.id}'
                                )
                            "
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            </div>

        `
        ).join("");

}

document
    .getElementById(
        "movementSearch"
    )
    .addEventListener(
        "input",
        renderMovements
    );

document
    .getElementById(
        "movementFilter"
    )
    .addEventListener(
        "change",
        renderMovements
    );

function editMovement(id) {

    const movement =
        data.movements.find(
            item =>
                item.id === id
        );

    if (!movement) {
        return;
    }

    document.getElementById(
        "movementId"
    ).value =
        movement.id;

    document.getElementById(
        "movementType"
    ).value =
        movement.type;

    document.getElementById(
        "movementDescription"
    ).value =
        movement.description;

    document.getElementById(
        "movementAmount"
    ).value =
        movement.amount;

    document.getElementById(
        "movementCategory"
    ).value =
        movement.category;

    document.getElementById(
        "movementDate"
    ).value =
        movement.date;

    openModal(
        "movementModal"
    );

}

function deleteMovement(id) {

    const confirmDelete =
        confirm(
            "¿Quieres eliminar este movimiento?"
        );

    if (!confirmDelete) {
        return;
    }

    data.movements =
        data.movements.filter(
            item =>
                item.id !== id
        );

    saveData();

    renderAll();

}

document
    .getElementById(
        "addOwedButton"
    )
    .addEventListener(
        "click",
        () => {

            openDebtModal(
                "owedToMe"
            );

        }
    );

document
    .getElementById(
        "addDebtButton"
    )
    .addEventListener(
        "click",
        () => {

            openDebtModal(
                "iOwe"
            );

        }
    );

function openDebtModal(
    type,
    id = null
) {

    document.getElementById(
        "debtForm"
    ).reset();

    document.getElementById(
        "debtType"
    ).value = type;

    document.getElementById(
        "debtId"
    ).value = id || "";

    if (id) {

        const list =
            type === "owedToMe"
                ? data.owedToMe
                : data.iOwe;

        const debt =
            list.find(
                item =>
                    item.id === id
            );

        if (debt) {

            document.getElementById(
                "debtPerson"
            ).value =
                debt.person;

            document.getElementById(
                "debtAmount"
            ).value =
                debt.saldo;

            document.getElementById(
                "debtDescription"
            ).value =
                debt.description || "";

        }

        document.getElementById(
            "debtModalTitle"
        ).textContent =
            "Editar deuda";

    } else {

        document.getElementById(
            "debtModalTitle"
        ).textContent =
            "Nueva deuda";

    }

    openModal(
        "debtModal"
    );

}

document
    .getElementById(
        "debtForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const id =
                document.getElementById(
                    "debtId"
                ).value;

            const type =
                document.getElementById(
                    "debtType"
                ).value;

            const person =
                document.getElementById(
                    "debtPerson"
                ).value.trim();

            const amount =
                Number(
                    document.getElementById(
                        "debtAmount"
                    ).value
                );

            const description =
                document.getElementById(
                    "debtDescription"
                ).value.trim();

            const list =
                type === "owedToMe"
                    ? data.owedToMe
                    : data.iOwe;

            if (id) {

                const debt =
                    list.find(
                        item =>
                            item.id === id
                    );

                if (debt) {

                    debt.saldo =
                        amount;

                    debt.description =
                        description;

                    debt.person =
                        person;

                }

            } else {

                list.push({

                    id:
                        generateId(),

                    person:
                        person,

                    montoOriginal:
                        amount,

                    saldo:
                        amount,

                    description:
                        description,

                    createdAt:
                        new Date()
                            .toISOString()

                });

            }

            saveData();

            closeModal(
                "debtModal"
            );

            renderAll();

        }
    );

function renderOwedToMe() {

    const container =
        document.getElementById(
            "owedList"
        );

    const total =
        data.owedToMe.reduce(

            (sum, debt) =>
                sum +
                Number(
                    debt.saldo
                ),

            0

        );

    document.getElementById(
        "totalOwedToMe"
    ).textContent =
        formatMoney(total);

    if (
        data.owedToMe.length === 0
    ) {

        container.innerHTML = `

            <div class="panel">

                <div class="empty-state">

                    No tienes registros
                    de personas que te deban.

                </div>

            </div>

        `;

        return;

    }

    container.innerHTML =
        data.owedToMe.map(
            debt =>
                createDebtCard(
                    debt,
                    "owedToMe"
                )
        ).join("");

}

function renderIOwe() {

    const container =
        document.getElementById(
            "debtList"
        );

    const total =
        data.iOwe.reduce(

            (sum, debt) =>
                sum +
                Number(
                    debt.saldo
                ),

            0

        );

    document.getElementById(
        "totalIOwe"
    ).textContent =
        formatMoney(total);

    if (
        data.iOwe.length === 0
    ) {

        container.innerHTML = `

            <div class="panel">

                <div class="empty-state">

                    No tienes registros
                    de deudas pendientes.

                </div>

            </div>

        `;

        return;

    }

    container.innerHTML =
        data.iOwe.map(
            debt =>
                createDebtCard(
                    debt,
                    "iOwe"
                )
        ).join("");

}

function createDebtCard(
    debt,
    type
) {

    const isPaid =
        Number(
            debt.saldo
        ) <= 0;

    const typeLabel =
        type === "owedToMe"
            ? "Me deben"
            : "Debo";

    return `

        <div class="debt-card">

            <div class="debt-card-header">

                <div>

                    <h3>
                        ${escapeHTML(
        debt.person
    )}
                    </h3>

                    <span>
                        ${typeLabel}
                    </span>

                </div>

                <span class="
                    debt-status
                    ${isPaid
            ? "paid"
            : ""
        }
                ">

                    ${isPaid
            ? "Pagado"
            : "Pendiente"
        }

                </span>

            </div>

            <p class="debt-description">

                ${escapeHTML(
            debt.description ||
            "Sin descripción"
        )}

            </p>

            <div class="debt-amounts">

                <div class="amount-box">

                    <span>
                        Deuda original
                    </span>

                    <strong>
                        ${formatMoney(
            debt.montoOriginal
        )}
                    </strong>

                </div>

                <div class="amount-box">

                    <span>
                        Saldo pendiente
                    </span>

                    <strong>
                        ${formatMoney(
            debt.saldo
        )}
                    </strong>

                </div>

            </div>

            <div class="debt-actions">

                <button
                    class="pay-button"
                    onclick="
                        openPaymentModal(
                            '${debt.id}',
                            '${type}'
                        )
                    "
                    ${isPaid
            ? "disabled"
            : ""
        }
                >

                    ${type === "owedToMe"
            ? "Registrar pago"
            : "Registrar pago"
        }

                </button>

                <button
                    class="increase-button"
                    onclick="
                        openIncreaseDebtModal(
                            '${debt.id}',
                            '${type}'
                        )
                    "
                >

                    Aumentar deuda

                </button>

                <button
                    onclick="
                        openDebtModal(
                            '${type}',
                            '${debt.id}'
                        )
                    "
                >

                    Editar

                </button>

                <button
                    onclick="
                        deleteDebt(
                            '${debt.id}',
                            '${type}'
                        )
                    "
                >

                    Eliminar

                </button>

            </div>

        </div>

    `;

}

function openPaymentModal(
    id,
    type
) {

    const list =
        type === "owedToMe"
            ? data.owedToMe
            : data.iOwe;

    const debt =
        list.find(
            item =>
                item.id === id
        );

    if (!debt) {
        return;
    }

    document.getElementById(
        "paymentDebtId"
    ).value =
        id;

    document.getElementById(
        "paymentDebtType"
    ).value =
        type;

    document.getElementById(
        "paymentCurrentBalance"
    ).textContent =
        formatMoney(
            debt.saldo
        );

    document.getElementById(
        "paymentAmount"
    ).value = "";

    document.getElementById(
        "paymentModalTitle"
    ).textContent =

        type === "owedToMe"

            ? `Pago recibido de ${debt.person}`

            : `Pago realizado a ${debt.person}`;

    openModal(
        "paymentModal"
    );

}

document
    .getElementById(
        "paymentForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const id =
                document.getElementById(
                    "paymentDebtId"
                ).value;

            const type =
                document.getElementById(
                    "paymentDebtType"
                ).value;

            const payment =
                Number(
                    document.getElementById(
                        "paymentAmount"
                    ).value
                );

            const list =
                type === "owedToMe"
                    ? data.owedToMe
                    : data.iOwe;

            const debt =
                list.find(
                    item =>
                        item.id === id
                );

            if (!debt) {
                return;
            }

            if (
                payment <= 0
            ) {

                alert(
                    "Ingresa un monto válido."
                );

                return;

            }

            if (
                payment > debt.saldo
            ) {

                alert(
                    "El pago no puede ser mayor al saldo pendiente."
                );

                return;

            }

            debt.saldo -= payment;

            data.movements.unshift({

                id:
                    generateId(),

                type:
                    type === "owedToMe"
                        ? "income"
                        : "expense",

                description:

                    type === "owedToMe"

                        ? `Pago recibido de ${debt.person}`

                        : `Pago realizado a ${debt.person}`,

                amount:
                    payment,

                category:
                    "debt",

                date:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            });

            saveData();

            closeModal(
                "paymentModal"
            );

            renderAll();

        }
    );

function openIncreaseDebtModal(
    id,
    type
) {

    const list =
        type === "owedToMe"
            ? data.owedToMe
            : data.iOwe;

    const debt =
        list.find(
            item =>
                item.id === id
        );

    if (!debt) {
        return;
    }

    document.getElementById(
        "increaseDebtId"
    ).value =
        id;

    document.getElementById(
        "increaseDebtType"
    ).value =
        type;

    document.getElementById(
        "increaseCurrentBalance"
    ).textContent =
        formatMoney(
            debt.saldo
        );

    document.getElementById(
        "increaseAmount"
    ).value = "";

    openModal(
        "increaseDebtModal"
    );

}

document
    .getElementById(
        "increaseDebtForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const id =
                document.getElementById(
                    "increaseDebtId"
                ).value;

            const type =
                document.getElementById(
                    "increaseDebtType"
                ).value;

            const amount =
                Number(
                    document.getElementById(
                        "increaseAmount"
                    ).value
                );

            const list =
                type === "owedToMe"
                    ? data.owedToMe
                    : data.iOwe;

            const debt =
                list.find(
                    item =>
                        item.id === id
                );

            if (!debt) {
                return;
            }

            if (
                amount <= 0
            ) {

                alert(
                    "Ingresa un monto válido."
                );

                return;

            }

            debt.saldo += amount;

            debt.montoOriginal +=
                amount;

            saveData();

            closeModal(
                "increaseDebtModal"
            );

            renderAll();

        }
    );

function deleteDebt(
    id,
    type
) {

    const confirmDelete =
        confirm(
            "¿Quieres eliminar este registro?"
        );

    if (!confirmDelete) {
        return;
    }

    if (
        type === "owedToMe"
    ) {

        data.owedToMe =
            data.owedToMe.filter(
                item =>
                    item.id !== id
            );

    } else {

        data.iOwe =
            data.iOwe.filter(
                item =>
                    item.id !== id
            );

    }

    saveData();

    renderAll();

}

document
    .getElementById(
        "addGoalButton"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "goalForm"
                )
                .reset();

            document
                .getElementById(
                    "goalId"
                )
                .value = "";

            openModal(
                "goalModal"
            );

        }
    );

document
    .getElementById(
        "goalForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const id =
                document.getElementById(
                    "goalId"
                ).value;

            const goal = {

                id:
                    id ||
                    generateId(),

                name:
                    document.getElementById(
                        "goalName"
                    ).value.trim(),

                target:
                    Number(
                        document.getElementById(
                            "goalTarget"
                        ).value
                    ),

                current:
                    Number(
                        document.getElementById(
                            "goalCurrent"
                        ).value
                    )

            };

            if (id) {

                const index =
                    data.goals.findIndex(
                        item =>
                            item.id === id
                    );

                if (index !== -1) {

                    data.goals[index] =
                        goal;

                }

            } else {

                data.goals.push(
                    goal
                );

            }

            saveData();

            closeModal(
                "goalModal"
            );

            renderAll();

        }
    );

function renderGoals() {

    const container =
        document.getElementById(
            "goalsList"
        );

    if (
        data.goals.length === 0
    ) {

        container.innerHTML = `

            <div class="panel">

                <div class="empty-state">

                    No tienes metas de ahorro.

                </div>

            </div>

        `;

        return;

    }

    container.innerHTML =
        data.goals.map(
            goal => {

                const percentage =
                    Math.min(

                        (
                            goal.current /
                            goal.target
                        ) * 100,

                        100

                    );

                return `

                    <div class="goal-card">

                        <h3>
                            ${escapeHTML(
                    goal.name
                )}
                        </h3>

                        <p>
                            Progreso de ahorro
                        </p>

                        <div class="
                            progress-container
                        ">

                            <div
                                class="progress-bar"
                                style="
                                    width:
                                    ${percentage}%
                                "
                            ></div>

                        </div>

                        <div class="goal-footer">

                            <strong>
                                ${formatMoney(
                    goal.current
                )}
                            </strong>

                            <span>
                                de
                                ${formatMoney(
                    goal.target
                )}
                            </span>

                        </div>

                        <div class="goal-actions">

                            <button
                                class="small-button"
                                onclick="
                                    editGoal(
                                        '${goal.id}'
                                    )
                                "
                            >
                                Editar
                            </button>

                            <button
                                class="small-button"
                                onclick="
                                    deleteGoal(
                                        '${goal.id}'
                                    )
                                "
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}

function editGoal(id) {

    const goal =
        data.goals.find(
            item =>
                item.id === id
        );

    if (!goal) {
        return;
    }

    document.getElementById(
        "goalId"
    ).value =
        goal.id;

    document.getElementById(
        "goalName"
    ).value =
        goal.name;

    document.getElementById(
        "goalTarget"
    ).value =
        goal.target;

    document.getElementById(
        "goalCurrent"
    ).value =
        goal.current;

    openModal(
        "goalModal"
    );

}

function deleteGoal(id) {

    if (
        !confirm(
            "¿Eliminar esta meta?"
        )
    ) {

        return;

    }

    data.goals =
        data.goals.filter(
            item =>
                item.id !== id
        );

    saveData();

    renderAll();

}

function calculateFinancials() {

    let income = 0;

    let expenses = 0;

    data.movements.forEach(
        movement => {

            if (
                movement.type === "income"
            ) {

                income +=
                    Number(
                        movement.amount
                    );

            } else {

                expenses +=
                    Number(
                        movement.amount
                    );

            }

        }
    );

    const available =
        income - expenses;

    const owedToMe =
        data.owedToMe.reduce(

            (sum, debt) =>
                sum +
                Number(
                    debt.saldo
                ),

            0

        );

    const iOwe =
        data.iOwe.reduce(

            (sum, debt) =>
                sum +
                Number(
                    debt.saldo
                ),

            0

        );

    return {

        income,

        expenses,

        available,

        owedToMe,

        iOwe,

        debtBalance:
            owedToMe - iOwe

    };

}

function renderDashboard() {

    const financials =
        calculateFinancials();

    document.getElementById(
        "availableMoney"
    ).textContent =
        formatMoney(
            financials.available
        );

    document.getElementById(
        "totalIncome"
    ).textContent =
        formatMoney(
            financials.income
        );

    document.getElementById(
        "totalExpenses"
    ).textContent =
        formatMoney(
            financials.expenses
        );

    document.getElementById(
        "debtBalance"
    ).textContent =
        formatMoney(
            financials.debtBalance
        );

    document.getElementById(
        "dashboardOwedToMe"
    ).textContent =
        formatMoney(
            financials.owedToMe
        );

    document.getElementById(
        "dashboardIOwe"
    ).textContent =
        formatMoney(
            financials.iOwe
        );

    document.getElementById(
        "dashboardDebtBalance"
    ).textContent =
        formatMoney(
            financials.debtBalance
        );

    renderRecentMovements();

}

function renderRecentMovements() {

    const container =
        document.getElementById(
            "recentMovements"
        );

    const movements =
        data.movements.slice(
            0,
            5
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

    container.innerHTML =
        movements.map(
            movement => `

            <div class="movement-item">

                <div class="movement-info">

                    <div class="
                        movement-icon
                        ${movement.type}
                    ">

                        ${movement.type === "income"
                    ? "↑"
                    : "↓"
                }

                    </div>

                    <div>

                        <h4>
                            ${escapeHTML(
                    movement.description
                )}
                        </h4>

                        <span>
                            ${formatDate(
                    movement.date
                )}
                        </span>

                    </div>

                </div>

                <strong class="
                    movement-amount
                    ${movement.type}
                ">

                    ${movement.type === "income"
                    ? "+"
                    : "-"
                }

                    ${formatMoney(
                    movement.amount
                )}

                </strong>

            </div>

        `
        ).join("");

}

let incomeExpenseChart = null;

let distributionChart = null;

function updateCharts() {

    const financials =
        calculateFinancials();

    const ctx1 =
        document.getElementById(
            "incomeExpenseChart"
        );

    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();

    }

    incomeExpenseChart =
        new Chart(
            ctx1,
            {

                type: "bar",

                data: {

                    labels: [
                        "Ingresos",
                        "Gastos"
                    ],

                    datasets: [

                        {

                            label:
                                "Soles",

                            data: [

                                financials.income,

                                financials.expenses

                            ],

                            backgroundColor: [

                                "#18a558",

                                "#e50914"

                            ],

                            borderRadius: 8

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }

            }
        );

    const ctx2 =
        document.getElementById(
            "distributionChart"
        );

    if (distributionChart) {

        distributionChart.destroy();

    }

    distributionChart =
        new Chart(
            ctx2,
            {

                type: "doughnut",

                data: {

                    labels: [

                        "Disponible",

                        "Me deben",

                        "Debo"

                    ],

                    datasets: [

                        {

                            data: [

                                Math.max(
                                    financials.available,
                                    0
                                ),

                                financials.owedToMe,

                                financials.iOwe

                            ],

                            backgroundColor: [

                                "#0b0b0d",

                                "#18a558",

                                "#e50914"

                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false

                }

            }
        );

}

function renderStatistics() {

    document.getElementById(
        "statMovementCount"
    ).textContent =
        data.movements.length;

    document.getElementById(
        "statOwedCount"
    ).textContent =
        data.owedToMe.length;

    document.getElementById(
        "statDebtCount"
    ).textContent =
        data.iOwe.length;

    document.getElementById(
        "statGoalCount"
    ).textContent =
        data.goals.length;

}

document
    .getElementById(
        "exportDataButton"
    )
    .addEventListener(
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

            link.href = url;

            link.download =
                `redfinance-backup-${new Date()
                    .toISOString()
                    .split("T")[0]
                }.json`;

            link.click();

            URL.revokeObjectURL(
                url
            );

        }
    );

document
    .getElementById(
        "importDataInput"
    )
    .addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                event => {

                    try {

                        const imported =
                            JSON.parse(
                                event.target.result
                            );

                        data = {

                            ...defaultData,

                            ...imported

                        };

                        saveData();

                        renderAll();

                        alert(
                            "Datos importados correctamente."
                        );

                    } catch (error) {

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

document
    .getElementById(
        "clearDataButton"
    )
    .addEventListener(
        "click",
        () => {

            const confirmDelete =
                confirm(
                    "¿Estás seguro? Se eliminarán todos tus datos."
                );

            if (!confirmDelete) {
                return;
            }

            data = {

                ...defaultData,

                movements: [],

                owedToMe: [],

                iOwe: [],

                goals: []

            };

            saveData();

            renderAll();

            alert(
                "Todos los datos han sido eliminados."
            );

        }
    );

function escapeHTML(value) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

function renderAll() {

    renderDashboard();

    renderMovements();

    renderOwedToMe();

    renderIOwe();

    renderGoals();

    renderStatistics();

    updateCharts();

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderAll();

    }
);
