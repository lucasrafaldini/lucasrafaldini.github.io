---
layout: default
title: Por que Rust é tão supervalorizado??
---
# Perguntas & Respostas
## Por que Rust é tão supervalorizado?
No âmbito da cibersegurança, manter a integridade dos arquivos é primordial. Este artigo apresenta um sofisticado script em Rust que não só realiza checagens de integridade de arquivos em um diretório especificado, mas também registra essas checagens de forma eficiente em um arquivo CSV. As características incomparáveis de segurança e performance do Rust o tornam a linguagem ideal para desenvolver tais ferramentas críticas de segurança. Vamos mergulhar no script e explorar por que Rust é a escolha superior para esta tarefa.
#### Por que Rust?
Rust é uma linguagem de programação moderna que enfatiza segurança, velocidade e concorrência. Suas capacidades de programação de sistemas a tornam uma escolha excepcional para o desenvolvimento de aplicações críticas de performance, como um verificador de integridade de arquivos. Aqui estão algumas razões-chave pelas quais Rust aprimora esse algoritmo:
- Segurança de Memória: O modelo de propriedade do Rust garante segurança de memória sem o sobrecusto de um coletor de lixo, tornando-o ideal para tarefas intensivas de recursos.
- Abstrações de Custo Zero: Rust oferece abstrações que não impõem sobrecarga adicional de tempo de execução, permitindo expressividade de alto nível e controle de baixo nível.
- Concorrência sem Medo: A abordagem do Rust para concorrência elimina condições de corrida de dados, permitindo que você escreva aplicativos multithread poderosos.
- Tempo de Execução Mínimo: Rust tem um tempo de execução mínimo e não necessita de uma máquina virtual, o que é benéfico para aplicações focadas em segurança, onde menos complexidade é preferível.
- Gerenciamento de Pacotes: O gerenciador de pacotes e sistema de build do Rust, Cargo, facilita o gerenciamento de dependências e garante builds reproduzíveis.
Com essas características em mente, vamos nos aprofundar no script Rust para verificação da integridade de arquivos.

#### Script Rust para Verificação de Integridade de Arquivos
```rust
use std::collections::HashMap;
use std::fs;
use std::hash::Hasher;
use std::io::{Read, Write};
use twox_hash::XxHash64;
use walkdir::WalkDir;
use csv::{Reader, Writer, StringRecord};

// Function to calculate the hash of a file, leveraging Rust's powerful hashing capabilities.
fn calculate_hash(file_path: &str) -> u64 {
    let mut hasher = XxHash64::default();
    let file_content = fs::read(file_path).expect("Failed to read the file");
    hasher.write(&file_content);
    hasher.finish()
}

fn main() {
    // Replace with the desired folder path.
    let folder_path = "/folder/path";

    // HashMap to store file paths and their corresponding hashes.
    let mut file_hashes: HashMap<String, u64> = HashMap::new();
    // Initialize the CSV writer to log hashes.
    let mut writer = Writer::from_path("file_hashes.csv").expect("Failed to create the CSV file");

    // Read existing hashes from the CSV file, if available.
    if let Ok(mut reader) = Reader::from_path("file_hashes.csv") {
        for result in reader.records() {
            if let Ok(record) = result {
                // Ensure the record has both a file path and a hash.
                if record.len() == 2 {
                    // Parse the hash and insert it into our HashMap.
                    if let Ok(hash) = record[1].parse::<u64>() {
                        file_hashes.insert(record[0].to_string(), hash);
                    }
                }
            }
        }
    }

    // Iterate over each entry in the directory.
    for entry in WalkDir::new(folder_path).into_iter().filter_map(|entry| entry.ok()) {
        // Proceed if the entry is a file.
        if entry.file_type().is_file() {
            let file_path = entry.path().to_str().unwrap().to_string();
            let file_hash = calculate_hash(&file_path);

            // Compare the computed hash with the previously stored one, if any.
            match file_hashes.get(&file_path) {
                Some(saved_hash) if *saved_hash == file_hash => {
                    println!("File {} remains unchanged.", &file_path);
                },
                _ => {
                    println!("File {} has been modified or is new. Updating hash.", &file_path);
                    file_hashes.insert(file_path.clone(), file_hash);
                }
            }
        }
    }

    // Update the CSV file with the latest hashes.
    for (file_path, hash) in &file_hashes {
        writer.write_record(&[file_path, &hash.to_string()]).expect("Failed to write to the CSV file");
    }
}
```
Este script Rust demonstra uma maneira segura e eficiente de verificar a integridade de arquivos e rastreá-los ao longo do tempo. As vantagens do Rust em segurança de memória, desempenho e concorrência o tornam uma excelente ferramenta para o desenvolvimento de aplicações seguras. Ao utilizar Rust, os desenvolvedores podem construir ferramentas de segurança robustas com confiança, sabendo que seu código não é apenas seguro, mas também eficiente.

Rust capacita os desenvolvedores a construir aplicações resilientes e performáticas, o que é inestimável no mundo da cibersegurança. 

Se você estiver interessado em aprender mais sobre Rust, confira o site [Rust Programming Language](https://www.rust-lang.org/).