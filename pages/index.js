import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar (props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props){
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="samllTitle">
        {props.title} ({props.items.length})
      </h2>

      <ul>
        {props.items.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`https://www.github.com/${itemAtual.login}`} target="_blank"> 
                <img src={`https://www.github.com/${itemAtual.login}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const usuario = 'RenatoMoratto';

  const [pessoasDaComunidade, setPessoasDaComunidade] = React.useState([]);
  const [comunidades, setComunidades] = React.useState([]);
  const [seguidores, setSeguidores] = React.useState([]);


  React.useEffect(() => {
    // Array de dados do GitHub
    fetch(`https://api.github.com/users/${usuario}/following`)
      .then(response => response.json())
      .then(respostaCompleta => setPessoasDaComunidade(respostaCompleta))

    fetch(`https://api.github.com/users/${usuario}/followers`)
      .then(response => response.json())
      .then(respostaCompleta => setSeguidores(respostaCompleta))

  // API GraphQL
    fetch(`https://graphql.datocms.com/`, {
      method: 'POST',
      headers: {
        'Authorization': 'ca5d5c9c520e2670cea1544ad5efeb',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }` })
    })
      .then(response => response.json())
      .then(respostaCompleta => setComunidades(respostaCompleta.data.allCommunities))

  }, []);

  return (
    <>
      <AlurakutMenu githubUser={ usuario }/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={ usuario } />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
              <h1 className="title">
                Bem vindo(a) { usuario }
              </h1>

              <OrkutNostalgicIconSet sexy="1" confiavel="3" legal="2" />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              
              const dadosDoForm = new FormData(e.target);
              
              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('imageUrl') ? dadosDoForm.get('imageUrl') : `https://picsum.photos/300/300?${new Date().getTime()}`,  // Se não tiver URL, gera uma aleatória
                creatorSlug: usuario,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade),
              })
                .then(async response => {
                  const dados = await response.json();
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                })

            }}>
              
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa | Deixe vazio para uma foto alatória" 
                  name="imageUrl"
                  aria-label="Coloque uma URL para usarmos de capa | Deixe vazio para uma foto alatória"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          
          <ProfileRelationsBoxWrapper>
            <h2 className="samllTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
                {comunidades.map((itemAtual) => {
                  return (
                    <li key={itemAtual.id}>
                      <a href={`https://www.google.com/search?q=${itemAtual.id}`} target="_blank"> 
                        <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBox title="Pessoas da Comunidade" items={pessoasDaComunidade} />
        </div>
      </MainGrid>
    </>
  );
}
