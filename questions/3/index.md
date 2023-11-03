---

layout: default
title: Lucas Rafaldini - Why is Rust so overrated?

---

# Questions

## Why is Rust so overrated?

### Elevate Your File Integrity Checks with Rust: A Secure and Performant Approach

#### Introduction

In the realm of cybersecurity, maintaining the integrity of files is paramount. This article showcases a sophisticated Rust script that not only performs file integrity checks within a specified directory but also logs these checks efficiently into a CSV file. Rust's unparalleled safety features and performance make it the ideal language for developing such critical security tools. Let's dive into the script and explore why Rust is the superior choice for this task.
Why Rust?

Rust is a modern programming language that emphasizes safety, speed, and concurrency. Its systems programming capabilities make it an outstanding choice for developing performance-critical applications such as a file integrity checker. Here are some key reasons why Rust enhances this algorithm:

- Memory Safety: Rust's ownership model ensures memory safety without the overhead of a garbage collector, making it ideal for resource-intensive tasks.
- Zero-Cost Abstractions: Rust provides abstractions that do not impose additional runtime overhead, allowing for both high-level expressiveness and low-level control.
- Fearless Concurrency: Rust’s approach to concurrency eliminates data races, enabling you to write powerful multithreaded applications.
- Minimal Runtime: Rust has minimal runtime and no necessity for a runtime or virtual machine, which is beneficial for security-focused applications where less complexity is preferable.
- Package Management: Rust's package manager and build system, Cargo, makes it easy to manage dependencies and ensure reproducible builds.

With these features in mind, let's delve into the Rust script for verifying file integrity.


#### Rust Script for File Integrity Verification

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

## Conclusion

This Rust script demonstrates a secure and efficient way to verify the integrity of files and track them over time. Rust's advantages in memory safety, performance, and concurrency make it an excellent tool for developing secure applications. By utilizing Rust, developers can construct robust security tools with confidence, knowing their code is not only safe but also efficient.

---

By providing insights into Rust's unique advantages, this article not only serves as a tutorial for creating a file integrity checker but also emphasizes the language's suitability for security-focused programming. Rust empowers developers to build resilient and performant applications, which is invaluable in the world of cybersecurity. If you're interested in learning more about Rust, check out the [Rust Programming Language](https://www.rust-lang.org/) website.
