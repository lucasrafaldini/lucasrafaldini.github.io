---
layout: default
title: Por que Rust é tão supervalorizado??
title_en: Why is Rust considered overhyped?
---
<section class="lang-en">
    <h1>Questions & Answers</h1>
    <h2>Why is Rust considered overhyped?</h2>
    <p>In cybersecurity, preserving file integrity is critical. The script below checks file integrity in a target directory and records hashes in a CSV file. Rust is often chosen for this kind of tooling because it combines memory safety with high performance and strong concurrency support.</p>
    <h4>Why Rust?</h4>
    <ul>
        <li><strong>Memory safety:</strong> Rust ownership rules help avoid memory bugs without requiring a garbage collector.</li>
        <li><strong>Zero-cost abstractions:</strong> High-level code without hidden runtime penalties.</li>
        <li><strong>Fearless concurrency:</strong> Strong compiler checks reduce data race risks.</li>
        <li><strong>Minimal runtime:</strong> Great for lightweight, security-sensitive tools.</li>
        <li><strong>Cargo ecosystem:</strong> Dependency and build management are straightforward and reproducible.</li>
    </ul>
    <h4>Rust Script for File Integrity Verification</h4>
</section>

<section class="lang-pt">
    <h1>Perguntas & Respostas</h1>
    <h2>Por que Rust e tao supervalorizado?</h2>
    <p>No ambito da ciberseguranca, manter a integridade dos arquivos e primordial. Este artigo apresenta um sofisticado script em Rust que nao so realiza checagens de integridade de arquivos em um diretorio especificado, mas tambem registra essas checagens de forma eficiente em um arquivo CSV. As caracteristicas incomparaveis de seguranca e performance do Rust o tornam a linguagem ideal para desenvolver tais ferramentas criticas de seguranca. Vamos mergulhar no script e explorar por que Rust e a escolha superior para esta tarefa.</p>
    <h4>Por que Rust?</h4>
    <p>Rust e uma linguagem de programacao moderna que enfatiza seguranca, velocidade e concorrencia. Suas capacidades de programacao de sistemas a tornam uma escolha excepcional para o desenvolvimento de aplicacoes criticas de performance, como um verificador de integridade de arquivos. Aqui estao algumas razoes-chave pelas quais Rust aprimora esse algoritmo:</p>
    <ul>
        <li>Seguranca de Memoria: O modelo de propriedade do Rust garante seguranca de memoria sem o sobrecusto de um coletor de lixo, tornando-o ideal para tarefas intensivas de recursos.</li>
        <li>Abstracoes de Custo Zero: Rust oferece abstracoes que nao impoem sobrecarga adicional de tempo de execucao, permitindo expressividade de alto nivel e controle de baixo nivel.</li>
        <li>Concorrencia sem Medo: A abordagem do Rust para concorrencia elimina condicoes de corrida de dados, permitindo que voce escreva aplicativos multithread poderosos.</li>
        <li>Tempo de Execucao Minimo: Rust tem um tempo de execucao minimo e nao necessita de uma maquina virtual, o que e benefico para aplicacoes focadas em seguranca, onde menos complexidade e preferivel.</li>
        <li>Gerenciamento de Pacotes: O gerenciador de pacotes e sistema de build do Rust, Cargo, facilita o gerenciamento de dependencias e garante builds reproduziveis.</li>
    </ul>
    <p>Com essas caracteristicas em mente, vamos nos aprofundar no script Rust para verificacao da integridade de arquivos.</p>
    <h4>Script Rust para Verificacao de Integridade de Arquivos</h4>
</section>

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

<section class="lang-en">
    <p>This script shows a safe and efficient way to verify file integrity and track changes over time. Rust's strengths in memory safety, performance, and concurrency make it an excellent fit for secure tooling.</p>
    <p>If you want to learn more, visit <a href="https://www.rust-lang.org/" target="_blank" rel="noopener">Rust Programming Language</a>.</p>
</section>

<section class="lang-pt">
    <p>Este script Rust demonstra uma maneira segura e eficiente de verificar a integridade de arquivos e rastrea-los ao longo do tempo. As vantagens do Rust em seguranca de memoria, desempenho e concorrencia o tornam uma excelente ferramenta para o desenvolvimento de aplicacoes seguras.</p>
    <p>Se voce estiver interessado em aprender mais sobre Rust, confira o site <a href="https://www.rust-lang.org/" target="_blank" rel="noopener">Rust Programming Language</a>.</p>
</section>