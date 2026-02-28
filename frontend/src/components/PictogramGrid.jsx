import Pictogram from './Pictogram.jsx';

const FASE_1_PICTOGRAMAS = ['agua', 'comer', 'brincar', 'mais', 'dormir', 'nao'];
const FASE_2_GRUPOS = {
  agua:    ['agua', 'suco', 'leite'],
  comer:   ['comer', 'lanche', 'fruta'],
  brincar: ['brincar', 'musica', 'tv'],
  dormir:  ['dormir', 'descansar'],
};

export default function PictogramGrid({ fase = 'CONEXAO', contexto = null, onSelect, disabled = false }) {
  if (fase === 'CONEXAO') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
        {FASE_1_PICTOGRAMAS.map((id) => (
          <Pictogram
            key={id}
            id={id}
            size="large"
            onPress={onSelect}
            disabled={disabled}
          />
        ))}
      </div>
    );
  }

  if (fase === 'ESCOLHA') {
    const opcoes = (contexto && FASE_2_GRUPOS[contexto]) || FASE_1_PICTOGRAMAS.slice(0, 4);
    const gridCols = opcoes.length <= 2 ? 'grid-cols-2' : 'grid-cols-2';

    return (
      <div className={`grid ${gridCols} gap-4 w-full max-w-sm mx-auto`}>
        {opcoes.map((id) => (
          <Pictogram
            key={id}
            id={id}
            size="large"
            onPress={onSelect}
            disabled={disabled}
          />
        ))}
      </div>
    );
  }

  if (fase === 'COMUNICACAO') {
    return (
      <div className="grid grid-cols-3 gap-2 w-full">
        {FASE_1_PICTOGRAMAS.map((id) => (
          <Pictogram
            key={id}
            id={id}
            size="medium"
            onPress={onSelect}
            disabled={disabled}
          />
        ))}
      </div>
    );
  }

  return null;
}
