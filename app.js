const brNumber = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 6 });
const brCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Converte texto numérico pt-BR para Number.
function parseNumberBR(value) {
  if (value === undefined || value === null) return NaN;
  const normalized = String(value).trim().replace(/\./g, '').replace(',', '.').replace(/\s/g, '');
  return Number(normalized);
}

// Formata número simples em pt-BR.
function formatNumberBR(value, digits = 2) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

// Formata moeda BRL.
function formatCurrencyBR(value) {
  return brCurrency.format(value);
}

// Exibe resultado em destaque.
function showResult(box, text) {
  box.classList.remove('error');
  box.innerHTML = `<p class="result-title">Resultado</p><p class="result-value">${text}</p>`;
  box.dataset.value = text;
}

// Exibe mensagem de erro amigável.
function showError(box, text) {
  box.classList.add('error');
  box.innerHTML = `<p class="result-title">Atenção</p><p class="result-value">${text}</p>`;
  box.dataset.value = '';
}

// Copia texto para área de transferência.
async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

// Compartilha texto; fallback para cópia.
async function shareText(text) {
  if (navigator.share) {
    await navigator.share({ text, url: location.href });
  } else {
    await copyText(text);
  }
}

// Limpa formulário e área de resultado.
function clearForm(form, resultBox) {
  form.reset();
  resultBox.innerHTML = '<p class="result-title">Resultado</p><p class="result-value">Preencha os campos e clique em calcular.</p>';
  resultBox.dataset.value = '';
}

// Calcula variações de porcentagem.
function calculatePercentage(type, valor, porcentagem) {
  if (type === 'quanto') {
    const result = (valor * porcentagem) / 100;
    return `${formatNumberBR(porcentagem)}% de ${formatNumberBR(valor)} = ${formatNumberBR(result)}`;
  }
  if (type === 'quantos') {
    const result = (valor / porcentagem) * 100;
    return `${formatNumberBR(valor)} é ${formatNumberBR(result)}% de ${formatNumberBR(porcentagem)}`;
  }
  if (type === 'aumentar') {
    const result = valor * (1 + porcentagem / 100);
    return `${formatNumberBR(valor)} com aumento de ${formatNumberBR(porcentagem)}% = ${formatNumberBR(result)}`;
  }
  const result = valor * (1 - porcentagem / 100);
  return `${formatNumberBR(valor)} com redução de ${formatNumberBR(porcentagem)}% = ${formatNumberBR(result)}`;
}

// Calcula desconto.
function calculateDiscount(preco, perc) {
  const desconto = preco * (perc / 100);
  const final = preco - desconto;
  return `Desconto: ${formatCurrencyBR(desconto)} · Preço final: ${formatCurrencyBR(final)} · Economia: ${formatCurrencyBR(desconto)}`;
}

// Calcula aumento.
function calculateIncrease(valor, perc) {
  const aumento = valor * (perc / 100);
  const novo = valor + aumento;
  return `Aumento: ${formatCurrencyBR(aumento)} · Novo valor: ${formatCurrencyBR(novo)}`;
}

// Calcula idade exata e próximo aniversário.
function calculateAge(nascimento, referencia = new Date()) {
  const birth = new Date(nascimento + 'T00:00:00');
  const ref = new Date(referencia);
  if (Number.isNaN(birth.getTime()) || birth > ref) return null;

  let years = ref.getFullYear() - birth.getFullYear();
  let months = ref.getMonth() - birth.getMonth();
  let days = ref.getDate() - birth.getDate();

  if (days < 0) {
    const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
    days += prevMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  let nextBirthday = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < ref) nextBirthday = new Date(ref.getFullYear() + 1, birth.getMonth(), birth.getDate());
  const daysToBirthday = Math.ceil((nextBirthday - ref) / 86400000);

  return `Você tem ${years} anos, ${months} meses e ${days} dias. Próximo aniversário em ${daysToBirthday} dias.`;
}

// Calcula diferença de dias.
function calculateDateDiff(dataIni, dataFim, incluirFinal = false) {
  const ini = new Date(dataIni + 'T00:00:00');
  const fim = new Date(dataFim + 'T00:00:00');
  if (Number.isNaN(ini.getTime()) || Number.isNaN(fim.getTime()) || fim < ini) return null;
  let total = Math.round((fim - ini) / 86400000);
  if (incluirFinal) total += 1;
  const semanas = total / 7;
  return `${total} dias (aprox. ${formatNumberBR(semanas, 2)} semanas).`;
}

// Calcula IMC e classifica.
function calculateBMI(peso, alturaRaw) {
  let altura = parseNumberBR(alturaRaw);
  if (altura > 3) altura = altura / 100;
  const imc = peso / (altura * altura);
  if (!Number.isFinite(imc)) return null;
  let faixa = 'obesidade';
  if (imc < 18.5) faixa = 'abaixo do peso';
  else if (imc < 25) faixa = 'peso normal';
  else if (imc < 30) faixa = 'sobrepeso';
  return `IMC ${formatNumberBR(imc, 2)} (${faixa}).`;
}

// Resolve regra de três simples.
function calculateRuleOfThree(a, b, c) {
  const x = (b * c) / a;
  return `X = (${formatNumberBR(b)} × ${formatNumberBR(c)}) ÷ ${formatNumberBR(a)} = ${formatNumberBR(x)}`;
}

// Calcula juros simples e montante.
function calculateSimpleInterest(capital, taxa, tempo, periodo) {
  let t = tempo;
  if (periodo === 'dias') t = tempo / 30;
  if (periodo === 'anos') t = tempo * 12;
  const juros = capital * (taxa / 100) * t;
  const montante = capital + juros;
  return `Juros: ${formatCurrencyBR(juros)} · Montante: ${formatCurrencyBR(montante)}`;
}

// Conversão kg e lbs.
function convertKgLbs(valor, direcao) {
  const result = direcao === 'kg-lbs' ? valor * 2.20462 : valor * 0.453592;
  return `${formatNumberBR(valor)} ${direcao === 'kg-lbs' ? 'kg' : 'lbs'} = ${formatNumberBR(result, 5)} ${direcao === 'kg-lbs' ? 'lbs' : 'kg'}`;
}

// Conversão cm e polegadas.
function convertCmInches(valor, direcao) {
  const result = direcao === 'cm-pol' ? valor * 0.393701 : valor * 2.54;
  return `${formatNumberBR(valor)} ${direcao === 'cm-pol' ? 'cm' : 'pol'} = ${formatNumberBR(result, 5)} ${direcao === 'cm-pol' ? 'pol' : 'cm'}`;
}

// Conversão de temperatura.
function convertTemperature(valor, direcao) {
  const result = direcao === 'c-f' ? (valor * 9) / 5 + 32 : ((valor - 32) * 5) / 9;
  return `${formatNumberBR(valor)}°${direcao === 'c-f' ? 'C' : 'F'} = ${formatNumberBR(result, 2)}°${direcao === 'c-f' ? 'F' : 'C'}`;
}

function handleCalculator(form) {
  const resultBox = form.querySelector('[data-result]');
  const kind = form.dataset.calculator;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    try {
      const fd = new FormData(form);
      let text = '';

      if (kind === 'porcentagem') {
        const valor = parseNumberBR(fd.get('valor'));
        const perc = parseNumberBR(fd.get('porcentagem'));
        if (!Number.isFinite(valor) || !Number.isFinite(perc) || (fd.get('operacao') === 'quantos' && perc === 0)) throw new Error('Preencha valor e porcentagem válidos.');
        text = calculatePercentage(fd.get('operacao'), valor, perc);
      } else if (kind === 'desconto') {
        const preco = parseNumberBR(fd.get('preco'));
        const desconto = parseNumberBR(fd.get('desconto'));
        if (!Number.isFinite(preco) || !Number.isFinite(desconto)) throw new Error('Informe preço e desconto válidos.');
        text = calculateDiscount(preco, desconto);
      } else if (kind === 'aumento') {
        const valor = parseNumberBR(fd.get('valor'));
        const aumento = parseNumberBR(fd.get('aumento'));
        if (!Number.isFinite(valor) || !Number.isFinite(aumento)) throw new Error('Informe valor inicial e aumento válidos.');
        text = calculateIncrease(valor, aumento);
      } else if (kind === 'idade') {
        const nasc = fd.get('nascimento');
        const ref = fd.get('referencia') || new Date().toISOString().slice(0, 10);
        const out = calculateAge(nasc, ref + 'T00:00:00');
        if (!out) throw new Error('Datas inválidas. A data de nascimento deve ser anterior à referência.');
        text = out;
      } else if (kind === 'dias') {
        const out = calculateDateDiff(fd.get('inicio'), fd.get('fim'), fd.get('incluir') === 'sim');
        if (!out) throw new Error('Informe um intervalo válido de datas.');
        text = out;
      } else if (kind === 'imc') {
        const peso = parseNumberBR(fd.get('peso'));
        const altura = fd.get('altura');
        if (!Number.isFinite(peso) || !altura) throw new Error('Informe peso e altura válidos.');
        const out = calculateBMI(peso, altura);
        if (!out) throw new Error('Não foi possível calcular o IMC com os dados informados.');
        text = out;
      } else if (kind === 'regra3') {
        const a = parseNumberBR(fd.get('a'));
        const b = parseNumberBR(fd.get('b'));
        const c = parseNumberBR(fd.get('c'));
        if (![a,b,c].every(Number.isFinite) || a === 0) throw new Error('Preencha A, B e C com números válidos (A diferente de zero).');
        text = calculateRuleOfThree(a, b, c);
      } else if (kind === 'juros') {
        const capital = parseNumberBR(fd.get('capital'));
        const taxa = parseNumberBR(fd.get('taxa'));
        const tempo = parseNumberBR(fd.get('tempo'));
        if (![capital,taxa,tempo].every(Number.isFinite)) throw new Error('Informe capital, taxa e tempo válidos.');
        text = calculateSimpleInterest(capital, taxa, tempo, fd.get('periodo'));
      } else if (kind === 'kg-lbs') {
        const valor = parseNumberBR(fd.get('valor'));
        if (!Number.isFinite(valor)) throw new Error('Informe um valor válido.');
        text = convertKgLbs(valor, fd.get('direcao'));
      } else if (kind === 'cm-pol') {
        const valor = parseNumberBR(fd.get('valor'));
        if (!Number.isFinite(valor)) throw new Error('Informe um valor válido.');
        text = convertCmInches(valor, fd.get('direcao'));
      } else if (kind === 'temp') {
        const valor = parseNumberBR(fd.get('valor'));
        if (!Number.isFinite(valor)) throw new Error('Informe uma temperatura válida.');
        text = convertTemperature(valor, fd.get('direcao'));
      }
      showResult(resultBox, text);
    } catch (err) {
      showError(resultBox, err.message);
    }
  });

  form.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.target.tagName !== 'TEXTAREA') {
      ev.preventDefault();
      form.requestSubmit();
    }
  });

  form.querySelector('[data-action="clear"]')?.addEventListener('click', () => clearForm(form, resultBox));

  form.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    const value = resultBox.dataset.value;
    if (!value) return showError(resultBox, 'Calcule primeiro para copiar o resultado.');
    await copyText(value);
    showResult(resultBox, `${value} (copiado!)`);
  });

  form.querySelector('[data-action="share"]')?.addEventListener('click', async () => {
    const value = resultBox.dataset.value;
    if (!value) return showError(resultBox, 'Calcule primeiro para compartilhar o resultado.');
    const text = `Calculei no MiniCalc: ${value}. Faça sua conta aqui: ${location.href}`;
    await shareText(text);
    showResult(resultBox, `${value} (pronto para compartilhar)`);
  });

  form.querySelector('[data-action="copy-link"]')?.addEventListener('click', async () => {
    await copyText(location.href);
    showResult(resultBox, 'Link desta calculadora copiado!');
  });
}

document.querySelectorAll('form[data-calculator]').forEach(handleCalculator);
